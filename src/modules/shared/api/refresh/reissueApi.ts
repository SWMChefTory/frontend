import clientRefreshingClient from "@/src/modules/shared/api/refresh/client/reissueClient";

interface ReissueTokenResponse {
  access_token: string;
  refresh_token: string;
}
interface RawReissueTokenRequest {
  refresh_token: string;
}

export async function reissueRefreshToken(
  refreshToken: string
): Promise<ReissueTokenResponse> {
  const rawRefreshTokenRequest: RawReissueTokenRequest = {
    refresh_token: refreshToken,
  };
  const response = await clientRefreshingClient.post(
    "/auth/token/reissue",
    rawRefreshTokenRequest,
  );
  return response.data;
}
