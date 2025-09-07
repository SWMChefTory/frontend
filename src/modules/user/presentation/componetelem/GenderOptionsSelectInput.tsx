import { useEffect, useRef } from "react";
import CheftorySelectInput from "./CheftorySelectInput";
import { DateOnly } from "@/src/modules/shared/utils/dateOnly";
import DateModal from "@/src/modules/user/presentation/components/modal/DateModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Gender } from "../../enums/Gender";
import GenderModal from "../components/modal/GenderModal";

export function GenderOptionsSelectInput({
    gender,
    handlePress,
    isFocused,
    toFocus,
    toBlur,
}: {
    gender: Gender|null;
    handlePress: (gender: Gender|null) => void;
    isFocused: boolean;
    toFocus: () => void;
    toBlur: () => void;
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
          label="성별"
          value={gender?.toString() || "선택 없음"}
          placeholder="성별을 선택하세요"
          left="chevron-down"
          isFocused={isFocused}
          toFocus={toFocus}  
        />
        <GenderModal bottomSheetModalRef={modalRef} onClickNextButton={handlePress} toBlur={toBlur} />
      </>
    );
  }