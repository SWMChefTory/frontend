import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipe } from "../api/api";

const isValidYouTubeUrl = (url: string): boolean => {
  const youtubePatterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(m\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtube\.com\/watch\?v=[\w-]+/,
  ];

  return youtubePatterns.some((pattern) => pattern.test(url.trim()));
};

export function useRecipeCreateViewModel() {
  const queryClient = useQueryClient();
  const {
    mutate: create,
    data,
    isPending: isLoading,
  } = useMutation({
    mutationFn: (youtubeUrl: string) => createRecipe(youtubeUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["recentRecipes"] 
      });
    },
  });

  const validateUrl = (url: string) => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      return "영상 링크를 입력해주세요";
    }

    if (!isValidYouTubeUrl(trimmedUrl)) {
      return "올바른 유튜브 링크를 입력해주세요";
    }

    return null;
  };

  return {
    recipeId: data?.recipe_id ?? null,
    isLoading,
    create,
    validateUrl,
  };
}
