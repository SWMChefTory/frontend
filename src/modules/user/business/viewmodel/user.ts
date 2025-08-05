import { DateOnly } from '@/src/modules/shared/utils/DateOnly';
import { Gender } from "@/src/modules/user/enums/Gender";
import { userSchema } from "@/src/modules/user/business/validation/userScheme";

export class User {
  readonly gender: Gender;
  readonly nickname: string;
  readonly dateOfBirth: DateOnly;
  
  private constructor(
    gender: Gender,
    nickname: string,
    dateOfBirth: DateOnly
  ) {
    this.gender = gender;
    this.nickname = nickname;
    this.dateOfBirth = dateOfBirth;
  }
  
  static create(data: {
    gender: Gender;
    nickname: string; // Nullish 제거 (Zod 스키마와 맞추기 위해)
    dateOfBirth: DateOnly | Date; // Nullish 제거
  }): User {
    const validatedData = userSchema.parse({
      gender: data.gender,
      nickname: data.nickname,
      dateOfBirth: data.dateOfBirth
    });

    // 객체에서 개별 값을 추출해서 전달
    return new User(
      validatedData.gender,
      validatedData.nickname,
      validatedData.dateOfBirth
    );
  }

  withNickname(nickname: string): User {
    return User.create({
      gender: this.gender,
      nickname,
      dateOfBirth: this.dateOfBirth,
    });
  }

  withDateOfBirth(dateOfBirth: DateOnly): User {
    return User.create({
      gender: this.gender,
      nickname: this.nickname,
      dateOfBirth,
    });
  }

  withGender(gender: Gender): User {
    return User.create({
      gender,
      nickname: this.nickname,
      dateOfBirth: this.dateOfBirth,
    });
  }
}