// 이벤트 이름 enum - 필요할 때 추가
export enum AmplitudeEvent {
  // Native - 앱 라이프사이클
  APP_LAUNCHED = "app_launched",

  // Native - 인증
  LOGIN_SUCCESS = "login_success",
  LOGOUT = "logout",

  // 레시피 관련
  RECIPE_CREATE = "recipe_create",
  RECIPE_VIEW = "recipe_view",

  // 조리 관련
  COOKING_START = "cooking_start",
  COOKING_END = "cooking_end",

  // 필요할 때 계속 추가...
}
