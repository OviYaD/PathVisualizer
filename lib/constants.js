export const ROWS = 15;

export const COLS_MIN = 20;
export const COLS_MAX = 46;
export const DEFAULT_COLS = 32;

export const WEIGHT_VALUE = 5;

export const SPEED_MIN = 1;
export const SPEED_MAX = 100;
export const DEFAULT_SPEED = 58;

export function getStartPos(cols) {
  return { row: Math.floor(ROWS / 2), col: Math.floor(cols * 0.18) };
}

export function getEndPos(cols) {
  return { row: Math.floor(ROWS / 2), col: Math.floor(cols * 0.82) };
}

// Maps a 1-100 "speed" slider value to a per-step animation delay in ms.
// Higher value = faster animation = shorter delay.
export function speedToDelay(value) {
  const delay = 82 - value * 0.78;
  return Math.max(2, Math.min(80, Math.round(delay)));
}
