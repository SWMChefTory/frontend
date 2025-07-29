import { PopularRecipeOverview } from "../api/api";

export class PopularSummaryRecipe {
  recipeId: string;
  title: string;
  youtubeId: string;
  count: number;
  thumbnailUrl: string;
  rank: number;

  private constructor(
    recipeId: string,
    title: string,
    youtubeId: string,
    count: number,
    thumbnailUrl: string,
    rank: number,
  ) {
    this.recipeId = recipeId;
    this.title = title;
    this.youtubeId = youtubeId;
    this.count = count;
    this.thumbnailUrl = thumbnailUrl;
    this.rank = rank;
  }

  static create(apiResponse: PopularRecipeOverview, rank: number): PopularSummaryRecipe {
    return new PopularSummaryRecipe(
      apiResponse.recipe_id,
      apiResponse.recipe_title,
      apiResponse.video_id,
      apiResponse.count,
      apiResponse.video_thumbnail_url,
      rank,
    );
  }
}
