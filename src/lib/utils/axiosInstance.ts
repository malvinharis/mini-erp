import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

/**
 * axios instance for Next.js route handlers (/api/*) — baseURL is relative
 * so it resolves against the current origin. Cookies (httpOnly session) go
 * same-origin automatically; no withCredentials needed.
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api/',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (userTimezone) {
    config.headers['x-vnd-user-timezone'] = userTimezone;
  }

  return config;
});

export type { AxiosError, AxiosRequestConfig, AxiosResponse };

export default axiosInstance;
