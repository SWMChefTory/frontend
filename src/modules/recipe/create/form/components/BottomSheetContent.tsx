import { useState, useEffect } from "react";
import { useRecipeCreateViewModel } from "@/src/modules/recipe/create/form/viewmodels/useViewModel";
import { View, StyleSheet } from "react-native";
  import { BottomSheetView } from "@gorhom/bottom-sheet";
import { RecipeFormHeader } from "./Header";
import { RecipeFormInput } from "./Input";
import { RecipeFormButton } from "./Button";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { SHADOW } from "@/src/modules/shared/constants/shadow";

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
    <BottomSheetView 
    style={styles.sheetContainer}
  >
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
    flexGrow: 1,
  },
  statusDot: {
    position: "absolute",
    top: responsiveHeight(16),
    right: responsiveWidth(20),
    width: responsiveWidth(14),
    height: responsiveHeight(14),
    backgroundColor: COLORS.background.orange,
    borderRadius: responsiveWidth(7),
    zIndex: 10,
    ...SHADOW,
    borderWidth: 1,
    borderColor: COLORS.border.white,
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.background.white,
    borderRadius: 24,
    padding: responsiveWidth(20),
  },
});
