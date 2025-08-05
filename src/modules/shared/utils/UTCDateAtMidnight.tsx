/**
 * UTCDateAtMidnight 객체를 다룰 때는 무조건 여기에서 정의된 함수만 사용하세요.
 */
export interface UTCDateAtMidnight extends Date {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  __utcMidnightBrand: true;
}

export function makeUTCDateAtMidnight(
  year: number,
  month: number,
  day: number,
): UTCDateAtMidnight {
  const d = new Date(Date.UTC(year, month - 1, day));
  Object.defineProperties(d, {
    year: { value: year, writable: false, enumerable: true },
    month: { value: month, writable: false, enumerable: true },
    day: { value: day, writable: false, enumerable: true },
    __utcMidnightBrand: { value: true, writable: false, enumerable: false },
  });

  return d as UTCDateAtMidnight;
}

export const fromString = (dateOfBirth: string) => {
  console.log(dateOfBirth);
  const [year, month, day] = dateOfBirth.split("-");
  console.log(year, month, day);
  return makeUTCDateAtMidnight(parseInt(year), parseInt(month), parseInt(day));
};

export const toString = (dateOfBirth: UTCDateAtMidnight | null | undefined) => {
  if (!dateOfBirth) {
    throw new Error("dateOfBirth is null or undefined");
  }
  return `${dateOfBirth.year}-${String(dateOfBirth.month + 1).padStart(2, "0")}-${String(dateOfBirth.day).padStart(2, "0")}`;
};

export const getMonth = (dateOfBirth: UTCDateAtMidnight | null | undefined) => {
  if (!dateOfBirth) {
    throw new Error("dateOfBirth is null or undefined");
  }
  return dateOfBirth.month + 1;
};

export const getYear = (dateOfBirth: UTCDateAtMidnight | null | undefined) => {
  if (!dateOfBirth) {
    throw new Error("dateOfBirth is null or undefined");
  }
  return dateOfBirth.year;
};

export const getDay = (dateOfBirth: UTCDateAtMidnight | null | undefined) => {
  if (!dateOfBirth) {
    throw new Error("dateOfBirth is null or undefined");
  }
  return dateOfBirth.day;
};
