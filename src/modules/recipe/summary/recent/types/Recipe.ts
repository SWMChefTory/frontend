import { RecentRecipeApiResponse } from "@/src/modules/recipe/summary/api/Api";

export class RecentSummaryRecipe {
  recipeId: string;
  title: string;
  youtubeId: string;
  createdAt: Date;
  thumbnailUrl: string;
  progress: number;
  watchedTime: string;

  private constructor(
    recipeId: string,
    title: string,
    youtubeId: string,
    createdAt: Date,
    thumbnailUrl: string,
    progress: number,
    watchedTime: string,
  ) {
    this.recipeId = recipeId;
    this.title = title;
    this.youtubeId = youtubeId;
    this.createdAt = createdAt;
    this.thumbnailUrl = thumbnailUrl;
    this.progress = progress;
    this.watchedTime = watchedTime;
  }

  static create(apiResponse: RecentRecipeApiResponse): RecentSummaryRecipe {
    return new RecentSummaryRecipe(
      apiResponse.recipeId,
      apiResponse.title,
      apiResponse.youtubeId,
      new Date(apiResponse.createdAt),
      apiResponse.thumbnailUrl,
      apiResponse.progress,
      apiResponse.watchedTime,
    );
  }
}
