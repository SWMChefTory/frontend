import PrivacyTermsAndConditionsPage from "@/src/modules/user/presentation/agreement/PrivacyTernsAndConditions";
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