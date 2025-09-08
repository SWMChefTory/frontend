import ServiceTermsAndConditionsPage from "@/src/modules/user/presentation/agreement/ServiceTermsAndConditions";
import { useEffect } from "react";
import { track } from "@/src/modules/shared/utils/analytics";

export default function ServiceTermsAndCondition() {
  useEffect(() => {
    track.screen("AgreementServiceTermsAndCondition");
  }, []);
  return (
    <ServiceTermsAndConditionsPage />
  );
}