export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  NONE = "NONE",
}

export function getGenderLabel(gender: Gender) {
  switch (gender) {
    case Gender.MALE:
      return "남성";
    case Gender.FEMALE:
      return "여성";
    case Gender.NONE:
      return "선택 없음";
  }
}

export function getGenderIconName(gender: Gender) {
  switch (gender) {
    case Gender.MALE:
      return "man";
    case Gender.FEMALE:
      return "woman";
    case Gender.NONE:
      return "remove-circle-outline";
  }
}
