import { useEffect, useRef } from "react";
import CheftorySelectInput from "./CheftorySelectInput";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import DateModal from "@/src/modules/user/presentation/components/modal/DateModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

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
        <CheftorySelectInput    
          label="생년월일"
          value={dateOfBirth?.toString() || "선택 없음"}
          placeholder="날짜를 선택하세요"
          left="calendar"
          isFocused={isFocused}
          toFocus={toFocus}  
          isValid={isValid}
        />
        <DateModal bottomSheetModalRef={modalRef} onClickNextButton={handlePress} toBlur={toBlur} />
      </>
    );
  }