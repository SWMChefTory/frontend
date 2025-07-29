export type UTCDateAtMidnight = Date & { __utcMidnightBrand: true };

export function makeUTCDateAtMidnight(year: number, month: number, day: number): UTCDateAtMidnight {
  const d = new Date(Date.UTC(year, month, day));
  return d as UTCDateAtMidnight;
}