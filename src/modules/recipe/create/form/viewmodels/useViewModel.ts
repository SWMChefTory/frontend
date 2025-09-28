import { useMutation } from "@tanstack/react-query";
import { createRecipe } from "../api/api";

const isValidYouTubeUrl = (url: string): boolean => {
  const youtubePatterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(m\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/,
    /^https?:\/\/(m\.)?youtube\.com\/shorts\/[\w-]+/,
  ];

  return youtubePatterns.some((pattern) => pattern.test(url.trim()));
};

const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

const convertToStandardYouTubeUrl = (url: string): string => {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    return url;
  }

  return `https://www.youtube.com/watch?v=${videoId}`;
};

export function useRecipeCreateViewModel() {
  const {
    mutate: createMutation,
    data,
    isPending: isLoading,
  } = useMutation({
    mutationFn: (youtubeUrl: string) => createRecipe(youtubeUrl),
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

  const create = (youtubeUrl: string) => {
    const trimmedUrl = youtubeUrl.trim();

    const validationError = validateUrl(trimmedUrl);
    if (validationError) {
      throw new Error(validationError);
    }

    const standardUrl = convertToStandardYouTubeUrl(trimmedUrl);

    createMutation(standardUrl);
  };

  return {
    recipeId: data?.recipe_id ?? null,
    isLoading,
    create,
    validateUrl,
  };
}