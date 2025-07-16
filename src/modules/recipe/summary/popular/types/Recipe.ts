import { PopularRecipeOverview } from "../api/api";

export class PopularSummaryRecipe {
  recipeId: string;
  title: string;
  youtubeId: string;
  count: number;
  thumbnailUrl: string;

  private constructor(
    recipeId: string,
    title: string,
    youtubeId: string,
    count: number,
    thumbnailUrl: string,
  ) {
    this.recipeId = recipeId;
    this.title = title;
    this.youtubeId = youtubeId;
    this.count = count;
    this.thumbnailUrl = thumbnailUrl;
  }

  static create(apiResponse: PopularRecipeOverview): PopularSummaryRecipe {
    return new PopularSummaryRecipe(
      apiResponse.id,
      apiResponse.videoInfo.title,
      apiResponse.videoInfo.videoId,
      apiResponse.count,
      apiResponse.videoInfo.thumbnailUrl,
    );
  }
}
