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
  FINISH_COOKING = "FINISH_COOKING",
  BACK_PRESSED = "BACK_PRESSED",
  CLEAR_HISTORY = "CLEAR_HISTORY",
}

export interface RecipeDetailState {
  isLoading: boolean;
  canGoBack: boolean;
  webViewKey: number;
}
