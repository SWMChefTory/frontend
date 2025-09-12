import { useEffect, useRef } from "react";
import SelectInputTemplate from "@/src/shared/components/textInputs/SelectInputTemplate";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import DateModal from "@/src/pages/change-date-of-birth/buttons/modal/DateModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";


  /**
   * 생년월일 입력 컴포넌트.
   * 버튼을 클릭하면 바텀 시트 모달이 등장하여 날짜를 선택할 수 있음.
   * @param dateOfBirth 생년월일
   * @param handlePress 모달에서 날짜를 선택하고 최종적으로 버튼을 눌렀을 때 호출되는 핸들러
   * @param isFocused 포커스 여부
   * @param toFocus 모달을 올리는 핸들러
   * @param toBlur 모달을 내리는 핸들러
   * @param isValid 유효성 여부
   * @returns 
   */
export function DateOfBirthSelectInput({
    dateOfBirth,
    handlePress,
    isFocused,
    toFocus,
    toBlur,
    isValid,
}: {
    dateOfBirth: DateOnly|null;
    handlePress: (date: DateOnly|null) => void;
    isFocused: boolean;
    toFocus: () => void;
    toBlur: () => void; 
    isValid: boolean|null;
}
) {
    const modalRef = useRef<BottomSheetModal>(null);

    useEffect(()=>{
        if(isFocused){
            modalRef.current?.present();
        }
        else{
            modalRef.current?.dismiss();
        }

    },[isFocused])
  
    return (
      <>
        <SelectInputTemplate    
          label="생년월일"
          value={dateOfBirth?.toString() || "선택 안함"}
          placeholder="날짜를 선택하세요"
          left="calendar"
          isFocused={isFocused}
          toFocus={toFocus}  
          isValid={isValid}
        />
        <DateModal bottomSheetModalRef={modalRef} onClickNextButton={handlePress} toBlur={toBlur} dateOfBirth={dateOfBirth} />
      </>
    );
  }