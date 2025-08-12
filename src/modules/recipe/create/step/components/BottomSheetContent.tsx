import { useMemo, useRef, useState } from "react";
import { View, StyleSheet, TextInput, FlatList, Text, ActivityIndicator, Pressable } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { useCreateCategoryViewModel } from "@/src/modules/recipe/category/categories/modal/useCreateViewModel";
import { useUpdateCategoryViewModel } from "@/src/modules/recipe/category/categories/useUpdateViewModel";
import { useCategoriesViewModel } from "@/src/modules/recipe/category/categories/useCategoriesViewModel";
import BottomSheetCategoryCard from "./BottomSheetCategoryCard";
import { Category as CategoryModel } from "@/src/modules/recipe/category/Category";
import BottomSheetAddCard from "./BottomSheetAddCard";


type Category = Pick<CategoryModel, "id" | "name" | "count">;

type GridItem =
| { type: "add" }
| { type: "empty"; id: string }
| { type: "category"; data: Category };

interface Props {
  recipeId: string;
  onDismiss: () => void;
}

export function RecipeCategoryBottomSheetContent({
  recipeId,
  onDismiss,
}: Props) {
  const { create, isCreating } = useCreateCategoryViewModel();
  const { updateCategory, updatingRecipeId } = useUpdateCategoryViewModel();
  const { categories } = useCategoriesViewModel();
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(currentCategoryId);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<TextInput>(null);

  const isBusy = isCreating || !!updatingRecipeId;

  const disabled = useMemo(() => {
    if (isBusy) return true;
    
    // 새 카테고리 생성 모드인 경우
    if (isCreatingNew) {
      return newCategoryName.trim().length === 0;
    }
    
    // 기존 카테고리 선택 모드인 경우 - 변경된 부분: 선택이 없어도 가능
    return selectedId === currentCategoryId;
  }, [newCategoryName, selectedId, currentCategoryId, isBusy, isCreatingNew]);

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedId(null);
    setNewCategoryName("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCancelCreate = () => {
    setIsCreatingNew(false);
    setNewCategoryName("");
    setSelectedId(currentCategoryId ?? (categories.length > 0 ? categories[0].id : null));
  };

  const handleSave = async () => {
    try {
      setError("");
      let targetCategoryId = selectedId;

      if (isCreatingNew) {
        const name = newCategoryName.trim();
        if (!name) {
          setError("카테고리 이름을 입력하세요.");
          return;
        }
        
        create(name);
        setIsCreatingNew(false);
        setSelectedId(null);
        setNewCategoryName("");
        setTimeout(() => inputRef.current?.focus(), 100);
        return;
      }

      if (!targetCategoryId) {
        setError("카테고리를 선택하세요.");
        return;
      }

      // 레시피 카테고리 업데이트
      await updateCategory({
        recipeId,
        previousCategoryId: currentCategoryId,
        targetCategoryId,
      });

      onDismiss();
    } catch (e: any) {
      setError(e?.message ?? "카테고리 저장 중 오류가 발생했습니다.");
    }
  };

  // 변경된 부분: 토글 기능 추가
  const handleCategorySelect = (id: string) => {
    setIsCreatingNew(false);
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
    setError("");
  };

  function createGridData(categories: Category[], columns = 3): GridItem[] {
    const items: GridItem[] = [
      { type: "add" as const },
      ...categories.map((c) => ({ type: "category" as const, data: c })),
    ];
  
    const remainder = items.length % columns;
    const emptyCount = (columns - remainder) % columns;
  
    for (let i = 0; i < emptyCount; i++) {
      items.push({ type: "empty" as const, id: `__empty__${i}` });
    }
    return items;
  }
  

  const renderItem = ({ item }: { item: GridItem }) => {
    if (item.type === "add") {
      return (
        <View style={styles.gridItem}>
          <BottomSheetAddCard onPress={handleCreateNew} />
        </View>
      );
    }
    
    // 변경된 부분: 빈 카드 처리
    if (item.type === "empty") {
      return <View style={styles.gridItem} />;
    }
    
    const category = item.data;
    return (
      <View style={styles.gridItem}>
        <BottomSheetCategoryCard
          id={category.id}
          name={category.name}
          count={category.count}
          selected={!isCreatingNew && selectedId === category.id}
          isCurrent={currentCategoryId === category.id}
          onPress={handleCategorySelect}
        />
      </View>
    );
  };

  const gridData = createGridData(categories, 3);

  return (
    <BottomSheetView style={styles.sheetContainer}>
      <View style={styles.statusDot} />
      <View style={styles.contentCard}>
        <Text style={styles.title}>카테고리 저장/이동</Text>
        <Text style={styles.subtitle}>레시피를 어떤 카테고리에 둘까요?</Text>

        {/* 카테고리 그리드 (Add 카드 포함) */}
        <View style={styles.categoriesSection}>
          <FlatList
            data={gridData}
            keyExtractor={(item: GridItem) => {
              if (item.type === "add") return "__add__";
              if (item.type === "empty") return item.id;
              return item.data.id;
            }}
            numColumns={3}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            style={styles.categoriesList}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.empty}>카테고리가 없습니다.</Text>
                <View style={styles.emptyGridContainer}>
                  <View style={styles.gridRow}>
                    <View style={styles.gridItem}>
                      <BottomSheetAddCard onPress={handleCreateNew} />
                    </View>
                    <View style={styles.gridItem} />
                    <View style={styles.gridItem} />
                  </View>
                </View>
              </View>
            }
          />
        </View>

        <View style={styles.newCategorySection}>
          {isCreatingNew ? (
            <View style={styles.createForm}>
              <Text style={styles.label}>새 카테고리 이름</Text>
              <TextInput
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="예) 면 요리, 자주 먹는 것"
                style={[styles.input, styles.inputFocused]}
                ref={inputRef}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#9AA0A6"
              />
              <Pressable style={styles.cancelCreate} onPress={handleCancelCreate}>
                <Text style={styles.cancelCreateText}>취소</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.placeholderSpace} />
          )}
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        {/* 버튼 영역 */}
        <View style={styles.btnRow}>
          <Pressable style={[styles.btn, styles.btnSecondary]} onPress={onDismiss} disabled={isBusy}>
            <Text style={styles.btnSecondaryText}>닫기</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, disabled ? styles.btnDisabled : styles.btnPrimary]}
            onPress={handleSave}
            disabled={disabled}
          >
            {isBusy ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnPrimaryText}>
                {isCreatingNew ? "생성" : "저장"}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  sheetContainer: { 
    flex: 1, 
    backgroundColor: COLORS.background.white, 
    paddingBottom: 0 
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
  title: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#111827" 
  },
  subtitle: { 
    marginTop: 4, 
    fontSize: 13, 
    color: "#6B7280" 
  },
  categoriesSection: {
    marginTop: 20,
    flex: 1,
  },
  categoriesList: {
    maxHeight: 375,
    minHeight: 375,
  },
  gridContainer: {
    paddingVertical: 8,
  },
  gridRow: {
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 16,
  },
  empty: { 
    textAlign: 'center',
    color: "#6B7280", 
    fontSize: 14,
    fontStyle: 'italic'
  },
  // 변경된 부분: 빈 상태에서도 그리드 유지
  emptyGridContainer: {
    width: '100%',
  },
  newCategorySection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  
  // 빈 공간 스타일 추가
  placeholderSpace: {
    height: 64, 
  },
  createButton: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.background.orange,
    borderRadius: 12,
    backgroundColor: COLORS.background.orange + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: COLORS.background.orange,
    fontWeight: '600',
    fontSize: 14,
  },
  createForm: {
    position: 'relative',
  },
  label: { 
    fontSize: 12, 
    color: "#6B7280", 
    marginBottom: 6 
  },
  input: {
    height: 44, 
    borderWidth: 1, 
    borderColor: "#E5E7EB", 
    borderRadius: 12,
    paddingHorizontal: 12, 
    backgroundColor: "#FFF", 
    fontSize: 14, 
    color: "#111827",
  },
  inputFocused: {
    borderColor: COLORS.background.orange,
    borderWidth: 2,
  },
  cancelCreate: {
    position: 'absolute',
    right: 8,
    top: 28,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelCreateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  error: { 
    marginTop: 8, 
    color: "#EF4444", 
    fontSize: 12 
  },
  btnRow: { 
    flexDirection: "row", 
    gap: 10, 
    marginTop: 20 
  },
  btn: { 
    flex: 1, 
    height: 48, 
    borderRadius: 12, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  btnSecondary: { 
    borderWidth: 1, 
    borderColor: "#E5E7EB", 
    backgroundColor: "#FFF" 
  },
  btnPrimary: { 
    backgroundColor: COLORS.background.orange 
  },
  btnDisabled: { 
    backgroundColor: "#F3F4F6" 
  },
  btnPrimaryText: { 
    color: "#FFF", 
    fontWeight: "700" 
  },
  btnSecondaryText: { 
    color: "#374151", 
    fontWeight: "600" 
  },
});