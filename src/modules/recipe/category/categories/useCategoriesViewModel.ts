import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api";
import { Category } from "../Category";

export function useCategoriesViewModel() {
  const { data } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  const categories =
    data?.categories.map((category) => Category.create(category)) || [];

  return {
    categories,
  };
}
