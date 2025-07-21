import axios, { isAxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: "https://cheftories.com/v1",
  timeout: 10000,
});

function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response && Boolean(error.request);
}

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (isAxiosError(error) && isNetworkError(error)) {
      setTimeout(() => Promise.reject(error), 200);
    } else {
      return Promise.reject(error);
    }
  },
);

export { axiosInstance };
