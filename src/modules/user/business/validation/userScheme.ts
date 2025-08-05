import { DateOnly } from "@/src/modules/shared/utils/DateOnly";
import { z } from "zod";
import { Gender } from "../../enums/Gender";

export const userSchema = z.object({
  gender: z.enum(Object.keys(Gender)).transform((val) => val as Gender),
  nickname: z
    .string()
    .min(2)
    .max(10)
    .regex(/^[가-힣a-zA-Z0-9\s]*$/, "한글, 영문, 숫자만 입력 가능합니다"),
  dateOfBirth: z.custom<DateOnly>(
    (val) => val instanceof DateOnly,
    "유효한 DateOnly 객체를 입력해주세요",
  ),
});
