import { useEffect, useRef } from "react";
import SelectInputTemplate from "../../../shared/components/textInputs/SelectInputTemplate";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Gender } from "../../../modules/user/enums/Gender";
import GenderModal from "@/src/pages/signup/gender/modal/GenderModal";

export function GenderOptionsSelectInput({
    gender,
    handlePress,
    isFocused,
    toFocus,
    toBlur,
    isValid,
}: {
    gender: Gender|null;
    handlePress: (gender: Gender|null) => void;
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
          label="성별"
          value={gender?.toString() || "선택 없음"}
          placeholder="성별을 선택하세요"
          left="chevron-down"
          isFocused={isFocused}
          toFocus={toFocus}  
          isValid={isValid}
        />
        <GenderModal bottomSheetModalRef={modalRef} gender={gender} onClickNextButton={handlePress} toBlur={toBlur} />
      </>
    );
  }