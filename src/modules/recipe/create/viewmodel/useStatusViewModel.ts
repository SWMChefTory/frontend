import { useEffect, useState } from "react";
import { fetchRecipeCreateStatus } from "../api/Api";
import { RecipeCreateStatus } from "../types/Status";

export function useRecipeCreateStatusViewModel(recipeId: string) {
  const [status, setStatus] = useState<RecipeCreateStatus>(
    RecipeCreateStatus.VIDEO_ANALYSIS,
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setError(null);
      try {
        const data = await fetchRecipeCreateStatus(recipeId);
        setStatus(data.status as RecipeCreateStatus);
      } catch (err) {
        setError(err as Error);
      }
    };

    void fetchStatus();

    const interval = setInterval(() => {
      void fetchStatus();
    }, 500);

    return () => clearInterval(interval);
  }, [recipeId]);

  return { status, error };
}
