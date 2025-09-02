import { View, Text, StyleSheet } from "react-native";
import { BottomSheetInput } from "./BottomSheetInput";
import { BottomSheetButton } from "./BottomSheetButton";
import { useState } from "react";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { useCreateCategoryViewModel } from "../../../category/categories/modal/useCreateViewModel";
import { useUpdateCategoryViewModel } from "../../../category/categories/useUpdateViewModel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {   
    onDismiss: () => void;
    recipeId: string;
    mode: "create" | "normal";
    changeMode: (mode: "create" | "normal") => void;
    selectedId: string | null;
}

export function BottomSheetCreateContent({ onDismiss, recipeId, mode, changeMode, selectedId }: Props) {

    const [newCategoryName, setNewCategoryName] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef<React.ComponentRef<typeof BottomSheetTextInput>>(null);
    const { create, isCreating } = useCreateCategoryViewModel();
    const { updateCategory, updatingCategoryId } = useUpdateCategoryViewModel();
    const insets = useSafeAreaInsets();

    const isBusy = isCreating || !!updatingCategoryId;

    const handleCancelCreate = () => {
        setNewCategoryName("");
        setError("");
        changeMode("normal");
    };
    
    const handleSave = async () => {
        try {
            setError("");
            const targetCategoryId = selectedId;
    
            if (mode === "create") {
                const name = newCategoryName.trim();
                if (!name) {
                    setError("카테고리 이름을 입력하세요.");
                    return;
                }
                
                await create(name);
                setNewCategoryName("");
                setError("");
                changeMode("normal");
                return;
            }

    
            if (!targetCategoryId) {
                setError("카테고리를 선택하세요.");
                return;
            }
    
            await updateCategory({
                recipeId,
                previousCategoryId: null,
                targetCategoryId,
            });
    
            onDismiss();
        } catch (e: any) {
            setError(e?.message ?? "카테고리 저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <View style={styles.contentSection}>
                {mode === "create" ? (
                    <View style={styles.createFormContainer}>
                        <Text style={styles.formTitle}>새 카테고리</Text>
                        <BottomSheetInput 
                            value={newCategoryName} 
                            onChangeText={setNewCategoryName} 
                            onCancel={handleCancelCreate} 
                            ref={inputRef}
                        />
                    </View>
                ) : null}
                
                {!!error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
            </View>

            <View style={styles.buttonSection}>
                <BottomSheetButton 
                    handleDismiss={onDismiss} 
                    isDisabled={isBusy} 
                    onPress={handleSave} 
                    isLoading={isCreating} 
                    buttonLabel={mode === "create" ? "생성" : "저장"} 
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    contentSection: {
        paddingHorizontal: 10,
        paddingTop: 6,
        paddingBottom: 4,
    },
    createFormContainer: {
        gap: 12,
        paddingVertical: 8,
    },
    formTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        minWidth: 80,
    },
    normalModeContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    readyText: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
    errorContainer: {
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#FEF2F2',
        borderRadius: 6,
        borderLeftWidth: 2,
        borderLeftColor: '#EF4444',
    },
    errorText: {
        fontSize: 12,
        color: '#DC2626',
    },
    buttonSection: {
        paddingHorizontal: 20,
    },
});