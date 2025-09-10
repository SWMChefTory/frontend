import axios, { isAxiosError } from "axios";

const clientRefreshingClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response && Boolean(error.request);
}

clientRefreshingClient.interceptors.response.use(
  async (res) => {
    console.log("refresh를 시도합니다.");
    return res;
  },
  async (error) => {
    console.log("refresh 실패.");
    console.log("error", error);
    if (isAxiosError(error) && isNetworkError(error)) {
      setTimeout(() => Promise.reject(error), 200);
    } else {
      return Promise.reject(error);
    }
  },
);

export default clientRefreshingClient;