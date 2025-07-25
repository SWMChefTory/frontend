import { RecentRecipeApiResponse } from "../api/api";

export class RecentSummaryRecipe {
  recipeId: string;
  title: string;
  youtubeId: string;
  createdAt: Date;
  thumbnailUrl: string;
  lastPlaySeconds: number;
  viewedAt: Date;

  private constructor(
    recipeId: string,
    title: string,
    youtubeId: string,
    createdAt: Date,
    thumbnailUrl: string,
    lastPlaySeconds: number,
    viewedAt: Date,
  ) {
    this.recipeId = recipeId;
    this.title = title;
    this.youtubeId = youtubeId;
    this.createdAt = createdAt;
    this.thumbnailUrl = thumbnailUrl;
    this.lastPlaySeconds = lastPlaySeconds;
    this.viewedAt = viewedAt;
  }

  static create(apiResponse: RecentRecipeApiResponse): RecentSummaryRecipe {
    return new RecentSummaryRecipe(
      apiResponse.recipe_id,
      apiResponse.recipe_title,
      apiResponse.video_id,
      new Date(apiResponse.viewed_at),
      apiResponse.video_thumbnail_url,
      apiResponse.last_play_seconds,
      new Date(apiResponse.viewed_at),
    );
  }
}
