import PrivacyTermsAndConditionsPage from "@/src/pages/privacy-terms-and-condition/PrivacyTernsAndConditionsPage";
import { useEffect } from "react";
import { track } from "@/src/modules/shared/utils/analytics";

function ServiceTermsAndConditions() {
  useEffect(() => {
    track.screen("AgreementServiceTermsAndConditions");
  }, []);
    return (
      <PrivacyTermsAndConditionsPage />
  );
}

export default ServiceTermsAndConditions;