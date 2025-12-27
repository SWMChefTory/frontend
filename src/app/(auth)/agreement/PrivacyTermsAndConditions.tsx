import PrivacyTermsAndConditionsPage from "@/src/pages/privacy-terms-and-condition/PrivacyTermsAndCondition";
import { useEffect } from "react";
import { track } from "@/src/modules/shared/utils/analytics";

function PrivacyTermsAndConditions() {
  useEffect(() => {
    track.screen("AgreementPrivacyTermsAndConditions");
  }, []);
  return <PrivacyTermsAndConditionsPage />;
}

export default PrivacyTermsAndConditions;
