import userStore from "@/store/user-store";
import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse
} from "axios";

export const ResultStatus = {
  SUCCESS: 0,
  ERROR: -1,
  TIMEOUT: 401,
} as const;

export type ResultStatus = typeof ResultStatus[keyof typeof ResultStatus];

export interface Result<T = unknown> {
  status: ResultStatus;
  message: string;
  data: T;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 50000,
  headers: {"Content-Type": "application/json;charset=utf-8"},
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = "Bearer Token";
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result<never>>) => {
    if (!res.data) throw new Error("The request failed, please try again later!");
    const {status, data, message} = res.data;
    if (status === ResultStatus.SUCCESS) {
      return data;
    }
    throw new Error(message || "The request failed, please try again later!");
  },
  (error: AxiosError<Result>) => {
    const {response} = error || {};
    if (response?.status === 401) {
      userStore.getState().actions.clearUserToken();
    }
    return Promise.reject(error);
  },
);

class APIClient {
  get<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({...config, method: "GET"});
  }

  post<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({...config, method: "POST"});
  }

  put<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({...config, method: "PUT"});
  }

  delete<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({...config, method: "DELETE"});
  }

  request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return axiosInstance.request<never, T>(config);
  }
}

export default new APIClient();