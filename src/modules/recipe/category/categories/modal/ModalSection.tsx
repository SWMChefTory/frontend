import { useState } from "react";
import { AddCategoryModal } from "./AddCategoryModal";
import { useCreateCategoryViewModel } from "./useCreateViewModel";

interface Props {
  openModal: boolean;
  onCloseModal: () => void;
}

export function CategoryCreateModal({ openModal, onCloseModal }: Props) {
  const { create, isCreating } = useCreateCategoryViewModel();
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleModalCancel = () => {
    if (isCreating) return;
    setNewCategoryName("");
    onCloseModal();
  };

  const addCategory = async () => {
    if (newCategoryName.trim() && !isCreating) {
      await create(newCategoryName.trim());
      setNewCategoryName("");
      onCloseModal();
    }
  };

  return (
    <AddCategoryModal
      visible={openModal}
      newCategoryName={newCategoryName}
      onChangeText={setNewCategoryName}
      onCancel={handleModalCancel}
      onConfirm={addCategory}
      isCreating={isCreating} // ✅ 생성 중 상태 전달
    />
  );
}
