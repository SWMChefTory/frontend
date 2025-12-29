import ServiceTermsAndConditionsPage from "@/src/pages/service-terms-and-condition/ServiceTermsAndCondition";
import { useEffect } from "react";
import { track } from "@/src/modules/shared/utils/analytics";

export default function ServiceTermsAndCondition() {
  useEffect(() => {
    track.screen("AgreementServiceTermsAndCondition");
  }, []);
  return <ServiceTermsAndConditionsPage />;
}
