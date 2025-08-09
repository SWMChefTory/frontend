// models/Recipe.ts
import { RecipeCreateStatus } from "./step/types/Status";
import { RecipeCreateStatusApiResponse } from "@/src/modules/recipe/create/step/api/api";

export class Recipe {
  readonly status: RecipeCreateStatus;
  readonly video: Recipe.VideoInfo;
  readonly ingredients: Recipe.Ingredients;
  readonly steps: Recipe.Step[];

  private constructor(
    status: RecipeCreateStatus,
    video: Recipe.VideoInfo,
    ingredients: Recipe.Ingredients,
    steps: Recipe.Step[],
  ) {
    this.status = status;
    this.video = video;
    this.ingredients = ingredients;
    this.steps = steps;
  }

  /** API 응답 -> 도메인 객체 */
  static fromApiResponse(res: RecipeCreateStatusApiResponse): Recipe {
    const video = new Recipe.VideoInfo(
      res.video_info.video_title,
      res.video_info.video_thumbnail_url,
      res.video_info.video_seconds,
      res.video_info.video_id,
    );

    const ingredients = new Recipe.Ingredients(
      res.ingredients_info.id,
      res.ingredients_info.ingredients.map(
        (i) => new Recipe.Ingredients.Item(i.name, i.amount, i.unit),
      ),
    );

    const steps = res.recipe_steps.map(
      (s) =>
        new Recipe.Step(
          s.step_order,
          s.subtitle,
          s.details,
          s.start_time,
          s.end_time,
        ),
    );

    return new Recipe(res.recipe_status, video, ingredients, steps);
  }

  /** 전체 스텝 수 */
  getStepCount(): number {
    return this.steps.length;
  }

  /** 전체 소요 시간(mm:ss) – 영상 길이 기준 */
  getFormattedDuration(): string {
    return this.video.getFormattedDuration();
  }

  /** 재료 요약 문자열 */
  getIngredientsSummary(): string {
    return this.ingredients.getSummary();
  }

  /** 특정 스텝 조회 (1-based order) */
  getStep(order: number): Recipe.Step | undefined {
    return this.steps.find((s) => s.order === order);
  }
}

export namespace Recipe {
  export class VideoInfo {
    constructor(
      public readonly title: string,
      public readonly thumbnailUrl: string,
      public readonly seconds: number,
      public readonly id: string,
    ) {}

    getFormattedDuration(): string {
      const m = Math.floor(this.seconds / 60);
      const s = this.seconds % 60;
      return `${m}:${s.toString().padStart(2, "0")}`;
    }
  }

  export class Ingredients {
    constructor(
      public readonly id: string,
      public readonly items: Ingredients.Item[],
    ) {}

    getSummary(): string {
      return this.items.map((i) => `${i.name} ${i.amount}${i.unit}`).join(", ");
    }
  }

  export namespace Ingredients {
    export class Item {
      constructor(
        public readonly name: string,
        public readonly amount: number,
        public readonly unit: string,
      ) {}
    }
  }

  export class Step {
    constructor(
      public readonly order: number,
      public readonly subtitle: string,
      public readonly details: string[],
      public readonly startTime: number,
      public readonly endTime: number,
    ) {}

    /** 스텝 구간 길이(초) */
    duration(): number {
      return Math.max(0, this.endTime - this.startTime);
    }
  }
}
