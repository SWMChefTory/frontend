import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory as updateCategoryApi } from "../api";
import { withMinDelay } from "@/src/modules/shared/utils/delay";
import { useState } from "react";

export function useUpdateCategoryViewModel() {
  const queryClient = useQueryClient();
  const [updatingRecipeId, setUpdatingRecipeId] = useState<string | null>(null);

  const { mutateAsync: updateCategoryMutation } = useMutation({
    mutationFn: ({
      recipeId,
      previousCategoryId,
      targetCategoryId,
    }: {
      recipeId: string;
      previousCategoryId: string | null;
      targetCategoryId: string;
    }) => withMinDelay(updateCategoryApi(recipeId, targetCategoryId), 500),

    onSuccess: (_, { previousCategoryId, targetCategoryId }) => {
      queryClient.invalidateQueries({
        queryKey: ["categoryRecipes", previousCategoryId],
      });
      queryClient.invalidateQueries({
        queryKey: ["categoryRecipes", targetCategoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategory = async ({
    recipeId,
    previousCategoryId,
    targetCategoryId,
  }: {
    recipeId: string;
    previousCategoryId: string | null;
    targetCategoryId: string;
  }) => {
    setUpdatingRecipeId(recipeId);
    try {
      const result = await updateCategoryMutation({
        recipeId,
        previousCategoryId,
        targetCategoryId,
      });
      return result;
    } finally {
      setUpdatingRecipeId(null);
    }
  };

  return { updateCategory, updatingRecipeId };
}
