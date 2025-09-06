import { useMemo, useRef, useState } from "react";
import { View, StyleSheet, FlatList, Text, ActivityIndicator, Pressable } from "react-native";
import { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import { COLORS } from "@/src/modules/shared/constants/colors";
import BottomSheetCategoryCard from "./BottomSheetCategoryCard";
import { Category as CategoryModel } from "@/src/modules/recipe/category/types/Category";
import BottomSheetAddCard from "./BottomSheetAddCard";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveFontSize, responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { useCategoriesViewModel } from "../../../category/categories/hooks/useCategoriesViewModel";


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
    top: responsiveHeight(16), 
    right: responsiveWidth(20), 
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
    padding: responsiveWidth(10),
  },
  title: { 
    fontSize: responsiveFontSize(18), 
    fontWeight: "700", 
    color: COLORS.text.black 
  },
  subtitle: { 
    marginTop: responsiveHeight(4), 
    fontSize: responsiveFontSize(13), 
    color: COLORS.text.gray 
  },
  categoriesSection: {
    marginTop: responsiveHeight(10),
    flex: 1,
  },
  categoriesList: {
    maxHeight: responsiveHeight(500),
    minHeight: responsiveHeight(200), 
  },
  gridContainer: {
    paddingVertical: responsiveHeight(8),
    paddingBottom: responsiveHeight(300),
  },
  gridRow: {
    justifyContent: 'flex-start',
    gap: responsiveWidth(8),
    marginBottom: responsiveHeight(8),
  },
  gridItem: {
    flex: 1,
    marginHorizontal: responsiveWidth(2),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: responsiveHeight(20),
    gap: responsiveWidth(16),
  },
  empty: { 
    textAlign: 'center',
    color: COLORS.text.gray, 
    fontSize: responsiveFontSize(14),
    fontStyle: 'italic'
  },
  // 변경된 부분: 빈 상태에서도 그리드 유지
  emptyGridContainer: {
    width: '100%',
  },
});