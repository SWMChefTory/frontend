import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import { Gender } from "@/src/modules/user/enums/Gender";
import { userSchema } from "@/src/modules/user/business/validation/userSchema";

export class User {
  readonly gender: Gender | null;
  readonly nickname: string;
  readonly dateOfBirth: DateOnly | null;
  readonly isMarketingAgreed: boolean;
  readonly isPrivacyAgreed: boolean;
  readonly isTermsOfUseAgreed: boolean;

  private constructor(
    gender: Gender | null,
    nickname: string,
    dateOfBirth: DateOnly | null,
    isMarketingAgreed: boolean,
    isPrivacyAgreed: boolean,
    isTermsOfUseAgreed: boolean,
  ) {
    this.gender = gender;
    this.nickname = nickname;
    this.dateOfBirth = dateOfBirth;
    this.isMarketingAgreed = isMarketingAgreed;
    this.isPrivacyAgreed = isPrivacyAgreed;
    this.isTermsOfUseAgreed = isTermsOfUseAgreed;
  }

  static create(data: {
    gender: Gender | undefined | null;
    nickname: string; // Nullish 제거 (Zod 스키마와 맞추기 위해)
    dateOfBirth: DateOnly | undefined | null; // Nullish 제거
    isMarketingAgreed: boolean;
    isPrivacyAgreed: boolean;
    isTermsOfUseAgreed: boolean;
  }): User {
    const validatedData = userSchema.parse({
      gender: data.gender,
      nickname: data.nickname,
      dateOfBirth: data.dateOfBirth,
      isMarketingAgreed: data.isMarketingAgreed,
      isPrivacyAgreed: data.isPrivacyAgreed,
      isTermsOfUseAgreed: data.isTermsOfUseAgreed,
    });

    // 객체에서 개별 값을 추출해서 전달
    return new User(
      validatedData.gender || null,
      validatedData.nickname,
      validatedData.dateOfBirth || null,
      validatedData.isMarketingAgreed,
      validatedData.isPrivacyAgreed,
      validatedData.isTermsOfUseAgreed,
    );
  }
}
