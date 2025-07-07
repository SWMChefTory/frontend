import { useEffect, useState } from "react";
import { PopularSummaryRecipe } from "@/src/modules/recipe/summary/popular/types/Recipe";
import { fetchRecipeSummary } from "@/src/modules/recipe/summary/api/Api";
import { RecentSummaryRecipe } from "@/src/modules/recipe/summary/recent/types/Recipe";

export function useRecipeSummaryViewModel(): {
  popularRecipes: PopularSummaryRecipe[];
  recentRecipes: RecentSummaryRecipe[];
  loading: boolean;
  error: Error | null;
} {
  const [popularRecipes, setPopularRecipes] = useState<PopularSummaryRecipe[]>(
    [],
  );
  const [recentRecipes, setRecentRecipes] = useState<RecentSummaryRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await fetchRecipeSummary();
        setPopularRecipes(
          data.popular.map((recipe) => PopularSummaryRecipe.create(recipe)),
        );
        setRecentRecipes(
          data.recent.map((recipe) => RecentSummaryRecipe.create(recipe)),
        );
      } catch (error) {
        setError(error as Error);
        setPopularRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchRecipes();
  }, []);

  return {
    popularRecipes: popularRecipes,
    recentRecipes: recentRecipes,
    loading,
    error,
  };
}
