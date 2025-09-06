import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory as deleteCategoryApi } from "@/src/modules/recipe/category/categories/api/api";
import { withMinDelay } from "@/src/modules/shared/utils/delay";
import { useState } from "react";

export function useDeleteCategoryViewModel() {
  const queryClient = useQueryClient();

  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );

  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: (categoryId: string) => {
      return withMinDelay(deleteCategoryApi(categoryId), 500);
    },
    onMutate: (categoryId) => {
      setDeletingCategoryId(categoryId);
    },
    onSettled: () => {
      setDeletingCategoryId(null);
    },
    onSuccess: (_, categoryId) => {
      queryClient.invalidateQueries({
        queryKey: ["categoryRecipes", categoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["categoryRecipes", null] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { deleteCategory, deletingCategoryId };
}
