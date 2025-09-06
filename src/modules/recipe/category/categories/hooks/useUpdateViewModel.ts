import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory as updateCategoryApi } from "@/src/modules/recipe/category/categories/api/api";
import { withMinDelay } from "@/src/modules/shared/utils/delay";
import { useState } from "react";

export function useUpdateCategoryViewModel() {
  const queryClient = useQueryClient();
  const [updatingCategoryId, setUpdatingCategoryId] = useState<string | null>(
    null,
  );

  const { mutateAsync: updateCategory } = useMutation({
    mutationFn: ({
      recipeId,
      previousCategoryId,
      targetCategoryId,
    }: {
      recipeId: string;
      previousCategoryId: string | null;
      targetCategoryId: string;
    }) => withMinDelay(updateCategoryApi(recipeId, targetCategoryId), 500),

    onMutate: ({ targetCategoryId }) => {
      setUpdatingCategoryId(targetCategoryId);
    },
    onSettled: () => {
      setUpdatingCategoryId(null);
    },

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
  return { updateCategory, updatingCategoryId };
}
