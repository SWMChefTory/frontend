import { useState } from "react";
import {
  Text,
  Keyboard,
  TouchableOpacity,
  View,
  AppState,
} from "react-native";
import {subcribeOpenCreatingView} from "@/src/widgets/create-recipe-view/event/videoUrlDeepLinkEvent";
import { useKeyboardAvoidingAnimation } from "@/src/shared/keyboard/useKeyboardAvoiding";
import { Button, TextInput } from "react-native-paper";
import { useCreatingRecipeViewStore } from "@/src/widgets/create-recipe-view/store/creatingRecipeViewStore";
import { sendMessage } from "@/src/shared/webview/sendMessage";
import Animated from "react-native-reanimated";
import {HelperText} from "react-native-paper";
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

export const RecipeCreatingView = () => {
  const { isCreatingOpened } = useCreatingRecipeViewStore();

  return <>{isCreatingOpened ? <RecipeCreatingViewReady /> : null}</>;
};

const CREATE_MESSAGE = "RECIPE_CREATE";

const RecipeCreatingViewReady = () => {
  const { closeCreatingView } = useCreatingRecipeViewStore();
  const [url, setUrl] = useState(()=>{
    return subcribeOpenCreatingView().url
  });
  const [hasEverTyped, setHasEverTyped] = useState(false);
  const { animatedStyle } = useKeyboardAvoidingAnimation();

  AppState.addEventListener("change", (state) => {
    if(state === "active"){
      if(url){
        return;
      }
      setUrl(subcribeOpenCreatingView().url);
    }
  });

  function isError() {
    return !isValidYouTubeUrl(url) && hasEverTyped;
  }
  function isSubmittable(){
    return isValidYouTubeUrl(url);
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss();
          closeCreatingView();
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1500,
        }}
      />

      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          },
          animatedStyle,
        ]}
      >
        <View
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            width: "100%",
          }}
        >
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              레시피 만들기
            </Text>
          </View>

          <View style={{ paddingHorizontal: 16, paddingBottom: 20, }}>
            <TextInput
              placeholder="유튜브 링크를 입력해주세요."
              autoFocus
              mode="outlined"
              theme={{
                colors: {
                  primary: "black",
                },
              }}
              error={isError()}
              value={url}
              onChangeText={(text) => {
                setUrl(text);
                setHasEverTyped(true);
              }}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
              }}
              right={
                <TextInput.Icon
                  icon="close-circle"
                  color="#c4c4c4"
                  onPress={() => {
                    setUrl("");
                  }}
                />
              }
            />
            <HelperText type="error" visible={isError()}>
              유튜브 링크를 입력해주세요.
            </HelperText>
          </View>

          <View style={{ padding: 12 }}>
            <Button
              mode="contained"
              onPress={() => {
                Keyboard.dismiss();
                sendMessage({
                  type: CREATE_MESSAGE,
                  data: { videoUrl: url },
                });
                closeCreatingView();
              }}
              disabled={!isSubmittable()}
              style={{
                borderRadius: 8,
                height: 56,
                width: "100%",
                justifyContent: "center",
                backgroundColor: !isSubmittable() ? "#ddd" : "#FB6836",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                }}
              >
                완료
              </Text>
            </Button>
          </View>
        </View>
      </Animated.View>
    </>
  );
};
