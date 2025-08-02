export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export function getGenderLabel(gender: Gender) {
  switch (gender) {
    case Gender.MALE:
      return "남성";
    case Gender.FEMALE:
      return "여성";
  }
}

export function getGenderIconName(gender: Gender) {
  switch (gender) {
    case Gender.MALE:
      return "man";
    case Gender.FEMALE:
      return "woman";
  }
}
