import userStore from "@/store/user-store";
import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse
} from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/v1/",
  timeout: 50000,
  headers: {"Content-Type": "application/json;charset=utf-8"},
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = userStore.getState().userToken?.authentication_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
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