import { useCallback, useEffect, useState } from "react";

/**
 * Thin wrapper around the Web Speech API (speechSynthesis). Works offline using
 * the device's built-in voices — no backend, no network.
 *
 * iOS Safari notes handled here:
 *  - Speech must be started from a direct user gesture (our tap).
 *  - Calling cancel() immediately before speak() can swallow the audio, so we
 *    only cancel when something is actually queued/playing.
 *  - iOS sometimes starts in a paused state, so we nudge it with resume().
 *  - getVoices() is empty until the async "voiceschanged" event, so we warm it.
 *  - Audio still respects the hardware mute switch and media volume.
 */
export function useSpeech() {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const [speaking, setSpeaking] = useState(false);

  // Warm up the voice list (needed on iOS/some browsers) and make sure speech
  // is stopped if this component unmounts.
  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.getVoices();
    const onVoices = () => synth.getVoices();
    synth.addEventListener?.("voiceschanged", onVoices);
    return () => {
      synth.removeEventListener?.("voiceschanged", onVoices);
      synth.cancel();
    };
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text.trim()) return;
      const synth = window.speechSynthesis;

      // Only cancel when needed — an unconditional cancel() right before speak()
      // can mute the next utterance on iOS.
      if (synth.speaking || synth.pending) synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.95; // a touch slower for younger listeners
      utterance.pitch = 1;
      utterance.volume = 1;

      const enVoice = synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith("en"));
      if (enVoice) utterance.voice = enVoice;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      setSpeaking(true);
      synth.speak(utterance);
      // iOS can leave the queue paused right after speak() — nudge it.
      synth.resume();
    },
    [supported]
  );

  return { supported, speaking, speak, stop };
}
