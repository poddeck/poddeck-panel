import userStore from "@/store/user-store";
import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse
} from "axios";
import userService from "./services/user-service.ts";

export interface AuthenticationRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/v1/",
  timeout: 50000,
  headers: {"Content-Type": "application/json;charset=utf-8"},
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = userStore.getState().token?.authentication_token;
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
  async (error: AxiosError) => {
    const originalRequest = error.config as AuthenticationRequestConfig;
    const {response} = error || {};
    if (response?.status === 401) {
      userStore.getState().actions.clearUserToken();
      return Promise.reject(error);
    }
    if (response?.status === 417 && !originalRequest._retry) {
      return refresh(originalRequest, error);
    }
    return Promise.reject(error);
  },
);

async function refresh(originalRequest: AuthenticationRequestConfig, error: AxiosError) {
  originalRequest._retry = true;
  const { refresh_token } = userStore.getState().token;
  if (!refresh_token) {
    userStore.getState().actions.clearUserToken();
    return Promise.reject(error);
  }
  if (isRefreshing) {
    return enqueueFailedRequest(originalRequest);
  }
  try {
    const authentication_token = await performRefresh(refresh_token);
    return retryRequestWithToken(originalRequest, authentication_token!);
  } catch (err) {
    userStore.getState().actions.clearUserToken();
    return Promise.reject(err);
  }
}

function enqueueFailedRequest(originalRequest: AuthenticationRequestConfig) {
  return new Promise<string>((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  }).then((token) => retryRequestWithToken(originalRequest, token))
    .catch(err => {
      originalRequest._retry = false;
      throw err;
    });
}

async function performRefresh(refresh_token: string) {
  isRefreshing = true;
  try {
    const refreshResponse = await userService.refresh({ refresh_token });
    const { authentication_token, refresh_token: newRefreshToken } = refreshResponse;
    userStore.getState().actions.setUserToken({
      authentication_token,
      refresh_token: newRefreshToken,
    });
    processQueue(null, authentication_token);
    return authentication_token;
  } catch (err) {
    processQueue(err, null);
    throw err;
  } finally {
    isRefreshing = false;
  }
}

function retryRequestWithToken(originalRequest: AuthenticationRequestConfig, token: string) {
  if (!originalRequest.headers) {
    originalRequest.headers = {};
  }
  originalRequest.headers["Authorization"] = `Bearer ${token}`;
  return axiosInstance.request(originalRequest);
}

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