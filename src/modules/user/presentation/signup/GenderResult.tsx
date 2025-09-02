import { View, Text } from "react-native";
import { Gender } from "../../enums/Gender";
import { InputTemplate } from "../components/InputTemplate";

function GenderResult({gender}: {gender: Gender|null}) {
    if (!gender) {
        return (
            <InputTemplate
                text="선택없음"
                setText={() => {}}
                inputAccessoryViewID={""}
            />
        )
    }

  return (
    <InputTemplate
                text={gender}
                setText={() => {}}
                inputAccessoryViewID={""}
            />
    );
}


export default GenderResult;