import { findAccessToken } from "@/src/modules/shared/storage/SecureStorage";
import { useEffect, useState } from "react";
import { refreshToken } from "@/src/modules/shared/api/client";

export function useRecipeDetailViewModel() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await findAccessToken();
      setAccessToken(token);
    };
    fetchAccessToken();
  }, []);

  const refetch = async () => {
    try {
      const token = await refreshToken();
      setAccessToken(token);
    } catch (error) {
      setAccessToken(null);
      throw error;
    }
  };

  return {
    accessToken,
    refetch,
  };
}
