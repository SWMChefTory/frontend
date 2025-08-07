import { client } from "@/src/modules/shared/api/client";

export async function deleteCategoryRecipe(recipeId: string) {
    return await client.delete(`/recipes/${recipeId}`);
}