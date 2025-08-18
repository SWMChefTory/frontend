import { useMemo, useRef, useState } from "react";
import { View, StyleSheet, FlatList, Text, ActivityIndicator, Pressable } from "react-native";
import { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import { COLORS } from "@/src/modules/shared/constants/colors";
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
  mode: "create" | "normal";
  selectedId: string | null;
  changeMode: (mode: "create" | "normal") => void;
  changeSelectedId: (id: string | null) => void;
}

export function RecipeCategoryBottomSheetContent({
  mode,
  changeMode,
  selectedId,
  changeSelectedId,
}: Props) {
  const { categories } = useCategoriesViewModel();

  const handleCreateNew = () => {
    changeMode("create");
    changeSelectedId(null);
  };

  const handleCategorySelect = (id: string) => {
    changeMode("normal");
    if (selectedId === id) {
      changeSelectedId(null);
    } else {
      changeSelectedId(id);
    }
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
          selected={mode === "normal" && selectedId === category.id}
          isCurrent={false}
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
          <BottomSheetFlatList  
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
    padding: 24,
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
    maxHeight: 500, // 350 → 500으로 증가
    minHeight: 200, // 최소 높이는 줄이기
  },
  gridContainer: {
    paddingVertical: 8,
    paddingBottom: 200,
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
});