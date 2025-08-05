import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteCategory as deleteCategoryApi } from "../api";
import { withMinDelay } from "@/src/modules/shared/utils/delay";

export function useDeleteCategoryViewModel() {
  const queryClient = useQueryClient();
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );

  const { mutateAsync: deleteCategoryMutation } = useMutation({
    mutationFn: (categoryId: string) =>
      withMinDelay(deleteCategoryApi(categoryId), 500),
    onSuccess: (_, categoryId) => {
      queryClient.invalidateQueries({
        queryKey: ["categoryRecipes", categoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["categoryRecipes", null] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategory = async (categoryId: string) => {
    setDeletingCategoryId(categoryId);

    try {
      const result = await deleteCategoryMutation(categoryId);
      return result;
    } finally {
      setDeletingCategoryId(null);
    }
  };

  return { deleteCategory, deletingCategoryId };
}
