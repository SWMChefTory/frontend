import { useMutation } from "@tanstack/react-query";
import { deleteCategoryRecipe as deleteCategoryRecipeApi } from "./api";
import { withMinDelay } from "@/src/modules/shared/utils/delay";
import { useQueryClient } from "@tanstack/react-query";

export function useDeleteViewModel() {
    const queryClient = useQueryClient();

    const { mutateAsync: deleteCategoryRecipe } = useMutation({
        mutationFn: async ({ recipeId, categoryId }: { recipeId: string; categoryId: string }) =>
            withMinDelay(deleteCategoryRecipeApi(recipeId), 500),
        onSuccess: (_, { categoryId }) => {
            queryClient.invalidateQueries({ queryKey: ["categoryRecipes", categoryId] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    return { deleteCategoryRecipe };
}