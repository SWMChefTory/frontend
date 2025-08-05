import { PopularRecipeOverview } from "../api/api";

export class PopularSummaryRecipe {
  recipeId: string;
  title: string;
  youtubeId: string;
  count: number;
  thumbnailUrl: string;
  rank: number;
  video_url: string;

  private constructor(
    recipeId: string,
    title: string,
    youtubeId: string,
    count: number,
    thumbnailUrl: string,
    rank: number,
    video_url: string,
  ) {
    this.recipeId = recipeId;
    this.title = title;
    this.youtubeId = youtubeId;
    this.count = count;
    this.thumbnailUrl = thumbnailUrl;
    this.rank = rank;
    this.video_url = video_url;
  }

  static create(
    apiResponse: PopularRecipeOverview,
    rank: number,
  ): PopularSummaryRecipe {
    return new PopularSummaryRecipe(
      apiResponse.recipe_id,
      apiResponse.recipe_title,
      apiResponse.video_id,
      apiResponse.count,
      apiResponse.video_thumbnail_url,
      rank,
      apiResponse.video_url,
    );
  }
}
