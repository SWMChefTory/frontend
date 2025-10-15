import { useState } from "react";
import {
  Text,
  Keyboard,
  TouchableOpacity,
  View,
} from "react-native";
import { useKeyboardAvoidingAnimation } from "@/src/shared/keyboard/useKeyboardAvoiding";
import { Button, HelperText, TextInput } from "react-native-paper";
import { sendMessage } from "@/src/shared/webview/sendMessage";
import Animated from "react-native-reanimated";
import { useCreatingCategoryViewStore } from "./store/creatingCategoryView";


export const CategoryCreatingView = () => {
  const { isCreatingOpened } = useCreatingCategoryViewStore();

  return <>{isCreatingOpened ? <CategoryCreatingViewReady /> : null}</>;
};

const CREATE_MESSAGE = "CATEGORY_CREATE";

const CategoryCreatingViewReady = () => {
  const { closeCreatingView } = useCreatingCategoryViewStore();
  const [hasEverTyped, setHasEverTyped] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const { animatedStyle } = useKeyboardAvoidingAnimation();

  function isError() {
    return !categoryName.trim() && hasEverTyped;
  }
  function isSubmittable(){
    return categoryName.trim();
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
              카테고리 생성
            </Text>
          </View>

          <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <TextInput
              placeholder="카테고리 이름을 입력해주세요."
              autoFocus
              mode="outlined"
              theme={{
                colors: {
                  primary: "black",
                },
              }}
              error={isError()}
              value={categoryName}
              onChangeText={(text) => {
                setCategoryName(text);
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
                    setCategoryName("");
                  }}
                />
              }
            />
            <HelperText type="error" visible={isError()}>
              카테고리 이름을 입력해주세요.
            </HelperText>
          </View>

          <View style={{ padding: 12 }}>
            <Button
              mode="contained"
              onPress={() => {
                Keyboard.dismiss();
                sendMessage({
                  type: CREATE_MESSAGE,
                  data: { categoryName: categoryName },
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
