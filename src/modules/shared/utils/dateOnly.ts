import { DateTime } from "luxon";
import { z } from "zod";

const dateOfBirthSchema = z
  .string()
  .min(1, "생년월일을 입력해주세요")
  .refine((dateStr) => {
    const parsed = DateTime.fromISO(dateStr);
    return parsed.isValid;
  }, "올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)")
  .refine((dateStr) => {
    const parsed = DateTime.fromISO(dateStr).startOf("day");
    const now = DateTime.now().startOf("day");
    console.log("parsed", parsed);
    console.log("now", now);
    return parsed <= now;
  }, "미래 날짜는 입력할 수 없습니다")
  .refine((dateStr) => {
    const parsed = DateTime.fromISO(dateStr);
    const minAge = DateTime.now().minus({ years: 120 });
    return parsed > minAge;
  }, "너무 오래된 날짜입니다");

export class DateOnly {
  readonly dateOfBirth: DateTime;

  private constructor(dateOfBirthString: string) {
    this.dateOfBirth = DateTime.fromISO(dateOfBirthString).startOf("day");
  }

  static create(dateOfBirth: string): DateOnly {
    console.log(dateOfBirth);
    const validatedDate = dateOfBirthSchema.parse(dateOfBirth);
    return new DateOnly(validatedDate);
  }

  public toString(): string {
    return this.dateOfBirth.toISODate() || "";
  }

  public toJSON(): string {
    const iso = this.dateOfBirth.toISODate();
    console.log("iso", iso);
    if (!iso) {
      throw new Error("DateOfBirth is null");
    }
    return iso;
  }
}
