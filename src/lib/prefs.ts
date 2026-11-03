// Small, standalone user preferences (separate from question progress).

const AUTO_READ_KEY = "zylerverse.autoRead";

/** Whether to read each new question aloud automatically. Defaults to on. */
export function getAutoRead(): boolean {
  try {
    return localStorage.getItem(AUTO_READ_KEY) !== "0";
  } catch {
    return true;
  }
}

export function setAutoRead(on: boolean): void {
  try {
    localStorage.setItem(AUTO_READ_KEY, on ? "1" : "0");
  } catch {
    // storage unavailable — preference stays at the default for this session
  }
}
