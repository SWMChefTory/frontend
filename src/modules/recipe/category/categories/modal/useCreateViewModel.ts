import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api/api";
import { withMinDelay } from "@/src/modules/shared/utils/delay";

export function useCreateCategoryViewModel() {
  const queryClient = useQueryClient();

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: (categoryName: string) =>
      withMinDelay(createCategory(categoryName), 500),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { create, isCreating };
}
