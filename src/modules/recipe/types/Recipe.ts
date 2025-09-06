import { PopularSummaryRecipeResponse } from "../summary/popular/api/api";
import { AllPopularRecipeResponse } from "@/src/modules/recipe/all/popular/api/api";
import { RecentSummaryRecipeApiResponse } from "../summary/recent/api/api";
import { RecentAllRecipeApiResponse } from "../all/recent/api/api";

export class PopularRecipe {
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
    apiResponse: PopularSummaryRecipeResponse | AllPopularRecipeResponse,
    rank: number,
  ): PopularRecipe {
    return new PopularRecipe(
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

export class RecentRecipe {
  recipeId: string;
  title: string;
  youtubeId: string;
  thumbnailUrl: string;
  lastPlaySeconds: number;
  viewedAt: Date;
  videoDuration: number;
  category: string;
  categoryId: string;
  private constructor(
    recipeId: string,
    title: string,
    youtubeId: string,
    thumbnailUrl: string,
    lastPlaySeconds: number,
    viewedAt: Date,
    videoDuration: number,
    category: string,
    categoryId: string,
  ) {
    this.recipeId = recipeId;
    this.title = title;
    this.youtubeId = youtubeId;
    this.thumbnailUrl = thumbnailUrl;
    this.lastPlaySeconds = lastPlaySeconds;
    this.viewedAt = viewedAt;
    this.videoDuration = videoDuration;
    this.category = category;
    this.categoryId = categoryId;
  }

  static create(
    apiResponse: RecentSummaryRecipeApiResponse | RecentAllRecipeApiResponse,
  ): RecentRecipe {
    return new RecentRecipe(
      apiResponse.recipe_id,
      apiResponse.recipe_title,
      apiResponse.video_id,
      apiResponse.video_thumbnail_url,
      apiResponse.last_play_seconds,
      new Date(apiResponse.viewed_at),
      apiResponse.video_seconds,
      apiResponse.category,
      apiResponse.category_id,
    );
  }

  getTimeAgo(): string {
    const now = new Date();
    const diffMs = now.getTime() - this.viewedAt.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) {
      return "방금 전";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else if (diffWeeks < 4) {
      return `${diffWeeks}주 전`;
    } else if (diffMonths < 12) {
      return `${diffMonths}개월 전`;
    } else {
      return `${diffYears}년 전`;
    }
  }
}
