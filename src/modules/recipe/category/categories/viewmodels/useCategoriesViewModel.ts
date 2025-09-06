import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/src/modules/recipe/category/categories/api/api";
import { Category } from "@/src/modules/recipe/category/categories/types/Category";

export function useCategoriesViewModel() {
  const { data, refetch } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  const categories =
    data?.categories.map((category) => Category.create(category)) || [];

  return {
    categories,
    refetch,
  };
}
