import { AxiosError } from "axios";

export function extractAxiosErrorInfo(
  err: AxiosError<ErrorData>,
): ErrorResponse {
  if (!err || !(err instanceof AxiosError)) {
    throw new Error("axios error가 아닙니다. " + err);
  }
  if (!err.response) {
    throw new Error("axios error에 response가 없습니다. " + err);
  }

  if (!err.code) {
    throw new Error("axios error에 code가 없습니다. " + err);
  }

  //data검사
  if (!err.response.data) {
    throw new Error("data가 없습니다." + err);
  }
  const response = err.response;

  if (!response.data.message) {
    throw new Error("message가 없습니다. " + err);
  }

  if (!response.data.error) {
    throw new Error("error가 없습니다. " + err);
  }

  return {
    code: err.response.status,
    message: response.data.message,
    error: response.data.error,
  };
}
