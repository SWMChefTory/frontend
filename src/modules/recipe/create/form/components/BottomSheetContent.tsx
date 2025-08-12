import { useState, useEffect } from "react";
import { useRecipeCreateViewModel } from "@/src/modules/recipe/create/form/viewmodels/useViewModel";
import { View, StyleSheet } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { RecipeFormHeader } from "./Header";
import { RecipeFormInput } from "./Input";
import { RecipeFormButton } from "./Button";
import { COLORS } from "@/src/modules/shared/constants/colors";

interface Props {
  onRecipeCreated?: (recipeId: string) => void;
  onDismiss: () => void;
  youtubeUrl: string;
}

export function RecipeBottomSheetContent({
  onRecipeCreated,
  onDismiss,
  youtubeUrl,
}: Props) {
  const [videoUrl, setVideoUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const { recipeId, isLoading, create, validateUrl } =
    useRecipeCreateViewModel();

  useEffect(() => {
    if (recipeId && !isLoading) {
      onDismiss();
      onRecipeCreated?.(recipeId);
    }
  }, [recipeId, isLoading]);

  useEffect(() => {
    if (youtubeUrl) {
      setVideoUrl(youtubeUrl);
    }
  }, [youtubeUrl]);

  const handleUrlChange = (text: string) => {
    setVideoUrl(text);
    setUrlError("");
  };

  const handleSubmit = () => {
    setUrlError("");
    const validationError = validateUrl(videoUrl);
    if (validationError) {
      setUrlError(validationError);
      return;
    }
    create(videoUrl);
    setVideoUrl("");
  };

  return (
    <BottomSheetView style={styles.sheetContainer}>
      <View style={styles.statusDot} />
      <View style={styles.contentCard}>
        <RecipeFormHeader
          title="AI 레시피 생성"
          subtitle="유튜브 영상을 분석해서 레시피를 만들어드려요"
        />
        <RecipeFormInput
          videoUrl={videoUrl}
          urlError={urlError}
          isLoading={isLoading}
          onUrlChange={handleUrlChange}
          label="유튜브 링크"
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <RecipeFormButton
          isLoading={isLoading}
          isDisabled={!videoUrl.trim() || isLoading || !!urlError}
          onSubmit={handleSubmit}
          createButtonLabel="레시피 만들기"
          progressButtonLabel="생성중..."
        />
      </View>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    backgroundColor: COLORS.background.white,
    paddingBottom: 0,
  },
  statusDot: {
    position: "absolute",
    top: 16,
    right: 20,
    width: 14,
    height: 14,
    backgroundColor: COLORS.background.orange,
    borderRadius: 7,
    zIndex: 10,
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: COLORS.border.white,
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.background.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
