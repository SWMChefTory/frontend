import { findAccessToken } from "@/src/modules/shared/storage/SecureStorage"; // Import findAccessToken
import { useEffect, useState } from "react";

export function useRecipeDetailViewModel() {
  const [accessToken, setAccessToken] = useState<string | null>(null); // State to hold accessToken

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await findAccessToken();
      setAccessToken(token);
    };
    fetchAccessToken();
  }, []);
  return {
    accessToken,
  };
}
