import { useEffect, useState } from "react";
import { createRecipe } from "../api/Api";

export function useRecipeCreateViewModel(youtubeUrl: string) {
  const [recipeId, setRecipeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!youtubeUrl) return;

    const createData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await createRecipe(youtubeUrl);
        setRecipeId(data.recipeId);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    void createData();
  }, [youtubeUrl]);

  return { recipeId, loading, error };
}
