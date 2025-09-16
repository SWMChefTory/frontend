export interface RecipeDetailParams {
  recipeId: string;
  youtubeId?: string;
  title?: string;
}

export interface WebViewMessage {
  type: string;
  data?: any;
}

export interface WebViewNavigationState {
  url: string;
  title: string;
  loading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

export enum WebViewMessageType {
  GO_HOME = "GO_HOME",
  REFRESH_TOKEN = "REFRESH_TOKEN",
  TIMER_START = "TIMER_START",
  TIMER_STOP = "TIMER_STOP",
  TIMER_CHECK = "TIMER_CHECK",
  TIMER_SET = "TIMER_SET",
}

export interface RecipeDetailState {
  isLoading: boolean;
  canGoBack: boolean;
}

export type TimerMessage = {
  type:
    | WebViewMessageType.TIMER_START
    | WebViewMessageType.TIMER_STOP
    | WebViewMessageType.TIMER_CHECK
    | WebViewMessageType.TIMER_SET;
  recipe_id: string;
  recipe_title: string;
  timer_time?: number;
};
