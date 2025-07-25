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
      apiResponse.recipe_id,
      apiResponse.recipe_title,
      apiResponse.video_id,
      apiResponse.count,
      apiResponse.video_thumbnail_url,
    );
  }
}
