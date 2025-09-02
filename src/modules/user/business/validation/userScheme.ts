import { DateOnly } from "@/src/modules/shared/utils/DateOnly";
import { z } from "zod";
import { Gender } from "../../enums/Gender";

export const userSchema = z.object({
  gender: z.enum(Object.keys(Gender)).transform((val) => val as Gender).optional(),
  nickname: z.string()
  .trim()
  .min(1, "닉네임을 입력해주세요"),
  isMarketingAgreed: z.boolean(),
  isPrivacyAgreed: z.boolean(),
  isTermsOfUseAgreed: z.boolean(),
  dateOfBirth: z.custom<DateOnly>(
    (val) => val instanceof DateOnly,
    "유효한 DateOnly 객체를 입력해주세요",
  ).optional(),
});
