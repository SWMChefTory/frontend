import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BlockSpacing,
  BlockSpacingType,
} from "@/src/shared/components/spacings/Spacing";
import {
  RadioButton,
  Text,
  TouchableRipple,
  useTheme,
  TextInput,
  MD3Colors,
  IconButton,
} from "react-native-paper";
import { useState } from "react";
import { useDeleteUserViewModel } from "@/src/modules/user/business/service/useAuthService";
import {
  FontSpacing,
  FontSpacingType,
} from "@/src/shared/components/spacings/FontSpacing";
import SquareButton from "@/src/shared/components/textInputs/SquareButtonTemplate";
import WriteCustomerFeedbackModal from "./WriteCustomerFeedbackModal";
import { track } from "@/src/modules/shared/utils/analytics";

const withdrawalReasons = {
  "1": "앱 사용법이 복잡해서",
  "2": "필요한 기능이 부족해서",
  "3": "다른 서비스를 이용하기 위해서",
  "4": "요리를 하지 않게 되어서",
  "5": "시간이 없어서 사용하지 않아서",
  "6": "다른 요리 앱을 사용하게 되어서",
  "7": "기타",
};

export default function MemberShipWithdrawalPage({
  userNickname,
}: {
  userNickname: string;
}) {
  const { deleteUser } = useDeleteUserViewModel();
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string }>(
    {}
  );

  const addItems = (
    key: string,
    selectedItems: { [key: string]: string },
    items: { [key: string]: string }
  ) => {
    setSelectedItems({ ...selectedItems, [key]: items[key] });
  };

  const deleteItems = (
    key: string,
    selectedItems: { [key: string]: string }
  ) => {
    const newSelectedItems = { ...selectedItems };
    delete newSelectedItems[key];
    setSelectedItems(newSelectedItems);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, width: "100%", justifyContent: "center" }}
      edges={["bottom"]}
    >
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={styles.container}>
          <View>
            <BlockSpacing type={BlockSpacingType.small} />
            <Text variant="titleLarge">{userNickname}님,</Text>
            <Text variant="titleLarge">정말 탈퇴하시나요?</Text>
            <FontSpacing type={FontSpacingType.medium} />
            <View>
              <Text variant="titleMedium">
                ⓘ 회원탈퇴 시 다음 정보가 삭제되어요.
              </Text>
              <FontSpacing type={FontSpacingType.small} />
              <View style={styles.fontSpacing}>
                <Text variant="bodyMedium">
                  - 저장된 모든 레시피 및 즐겨찾기
                </Text>
                <Text variant="bodyMedium">- 생성한 카테고리 및 요리 기록</Text>
                <Text variant="bodyMedium">- 회원 개인 정보</Text>
              </View>
            </View>
            <BlockSpacing type={BlockSpacingType.large} />
            <Text variant="titleLarge">떠나시는 이유를 알려주세요.</Text>
            <FontSpacing type={FontSpacingType.medium} />
            <Text variant="titleMedium" style={{ color: "#787777" }}>
              돌아오실 때 더 좋은 서비스를 제공할게요.
            </Text>
            <FontSpacing type={FontSpacingType.small} />

            <RadioButtonItemGroup
              items={withdrawalReasons}
              addItems={addItems}
              deleteItems={deleteItems}
              selectedItems={selectedItems}
            />
          </View>
          <BlockSpacing type={BlockSpacingType.xlarge} />

          <SquareButton
            label="탈퇴하기"
            onPress={() => {
              deleteUser();
              track.event("membership_withdrawal_submitted", {
                selectedItems,
              });
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RadioButtonItemGroup({
  items,
  addItems,
  deleteItems,
  selectedItems,
}: {
  items: { [key: string]: string };
  addItems: (
    key: string,
    selectedItems: { [key: string]: string },
    items: { [key: string]: string }
  ) => void;
  deleteItems: (key: string, selectedItems: { [key: string]: string }) => void;
  selectedItems: { [key: string]: string };
  rightButton?: React.ReactNode;
}) {
  return (
    <View>
      {Object.keys(items).map((key: string) => (
        <RadioButtonItem
          key={key}
          item={items[key]}
          addItems={() => addItems(key, selectedItems, items)}
          deleteItems={() => deleteItems(key, selectedItems)}
          isChecked={selectedItems[key] ? true : false}
        />
      ))}
    </View>
  );
}

function RadioButtonItem({
  item,
  addItems,
  deleteItems,
  isChecked,
}: {
  item: string;
  addItems: (value: string) => void;
  deleteItems: (value: string) => void;
  isChecked: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={styles.radioButtonItem}>
      <TouchableRipple
        style={{flex: 1}}
        onPress={() => (isChecked ? deleteItems(item) : addItems(item))}
      >
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value={item}
            status={"checked"}
            color={
              isChecked ? theme.colors.primary : theme.colors.onSurfaceDisabled
            }
          />
          <Text
            style={{
              color: isChecked
                ? theme.colors.primary
                : theme.colors.onSurfaceDisabled,
            }}
            variant="bodyMedium"
          >
            {item}
          </Text>
        </View>
      </TouchableRipple>
        <WriteButton label={item} isDisabled={!isChecked} />
    </View>
  );
}

function WriteButton({
  isDisabled,
  label,
  // onPress,
}: {
  label: string;
  isDisabled: boolean;
  // onPress: () => void;
}) {
  const theme = useTheme();
  const [isVisible, setModalVisible] = useState(false);
  return (
    <>
      <IconButton
        size={20}
        icon="pencil-outline"
        iconColor={
          isDisabled ? theme.colors.onSurfaceDisabled : theme.colors.primary
        }
        disabled={isDisabled}
        onPress={() => setModalVisible(true)}
      />
      <WriteCustomerFeedbackModal
        label={label}
        isVisible={isVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "85%",
  },
  fontSpacing: {
    paddingLeft: 8,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButtonItem: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  radioButtonRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
