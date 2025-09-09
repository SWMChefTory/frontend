import clientRefreshingClient from "@/src/modules/shared/api/refresh/client/reissueClient";

interface ReissueTokenResponse {
  access_token: string;
  refresh_token: string;
}

export async function reissueRefreshToken(
  refreshToken: string
): Promise<ReissueTokenResponse> {
  const refreshTokenRequest = refreshToken;
  const response = await clientRefreshingClient.post(
    "/auth/token/reissue",
    refreshTokenRequest
  );
  return response.data;
}
