import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Thin wrapper around the Web Speech API (speechSynthesis). Works offline using
 * the device's built-in voices — no backend, no network.
 *
 * `speak(input, onFinished)` accepts a single string or an array of parts. When
 * given parts, each is spoken as its own utterance with a short SILENCE GAP
 * between them (so e.g. options are clearly separated by ear). `onFinished` is
 * called ONLY when the whole thing finishes naturally — not when it is stopped,
 * replaced by another speak(), or the component unmounts (navigating away).
 *
 * Robustness handled here:
 *  - Hold a reference to the current utterance so Chrome can't garbage-collect
 *    it mid-speech (a common cause of speech stopping and onend never firing).
 *  - A pause()/resume() keep-alive every few seconds works around Chrome's
 *    ~15s stall where `speaking` gets stuck true and onend never fires.
 *  - iOS: speech must start from a user gesture; auto-play may be blocked until
 *    the first tap. Only cancel() when something is playing (an unconditional
 *    cancel before speak can mute iOS). resume() nudges iOS out of a paused start.
 *  - getVoices() is warmed via the async "voiceschanged" event.
 *  - Audio still respects the hardware mute switch and media volume.
 */
export function useSpeech() {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const [speaking, setSpeaking] = useState(false);
  // Generation token: every speak()/stop()/unmount bumps it, invalidating any
  // chain still running from a previous call.
  const tokenRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Keep a live reference to the current utterance so it isn't GC'd mid-speech.
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const clearTimer = () => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  const clearKeepAlive = () => {
    if (keepAliveRef.current != null) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  };

  const teardown = useCallback(() => {
    clearTimer();
    clearKeepAlive();
    utterRef.current = null;
  }, []);

  // Warm the voice list and stop speech if this component unmounts. Unmount
  // counts as an interruption, so onFinished won't fire.
  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.getVoices();
    const onVoices = () => synth.getVoices();
    synth.addEventListener?.("voiceschanged", onVoices);
    return () => {
      synth.removeEventListener?.("voiceschanged", onVoices);
      tokenRef.current++;
      teardown();
      synth.cancel();
    };
  }, [supported, teardown]);

  const stop = useCallback(() => {
    if (!supported) return;
    tokenRef.current++;
    teardown();
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported, teardown]);

  const speak = useCallback(
    (input: string | string[], onFinished?: () => void, gapMs = 650) => {
      if (!supported) return;
      const parts = (Array.isArray(input) ? input : [input]).map((s) => s.trim()).filter(Boolean);
      if (parts.length === 0) return;

      const synth = window.speechSynthesis;
      const myToken = ++tokenRef.current; // new generation, invalidates any prior chain
      teardown();
      if (synth.speaking || synth.pending) synth.cancel();

      const enVoice = synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith("en"));

      const finish = (natural: boolean) => {
        if (tokenRef.current !== myToken) return;
        clearKeepAlive();
        utterRef.current = null;
        setSpeaking(false);
        if (natural) onFinished?.();
      };

      let i = 0;
      const speakNext = () => {
        if (tokenRef.current !== myToken) return; // superseded by a newer call
        const utterance = new SpeechSynthesisUtterance(parts[i]);
        utterance.lang = "en-US";
        utterance.rate = 0.95; // a touch slower for younger listeners
        utterance.pitch = 1;
        utterance.volume = 1;
        if (enVoice) utterance.voice = enVoice;

        utterance.onend = () => {
          if (tokenRef.current !== myToken) return;
          i += 1;
          if (i >= parts.length) finish(true);
          else timerRef.current = setTimeout(speakNext, gapMs); // silent gap between parts
        };
        utterance.onerror = () => finish(false);

        utterRef.current = utterance; // retain so Chrome doesn't GC it mid-speech
        synth.speak(utterance);
        synth.resume(); // iOS can leave the queue paused right after speak()
      };

      // Keep-alive: work around Chrome's ~15s stall where onend never fires.
      keepAliveRef.current = setInterval(() => {
        if (tokenRef.current !== myToken) return;
        if (synth.speaking && !synth.paused) {
          synth.pause();
          synth.resume();
        }
      }, 8000);

      setSpeaking(true);
      speakNext();
    },
    [supported, teardown]
  );

  return { supported, speaking, speak, stop };
}
