'use client';

import type { AxiosError, AxiosRequestConfig } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

import type { ApiError, ApiResponse } from '@/lib/schemas';
import axiosInstance from '@/lib/utils/axiosInstance';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface FetcherConfig {
  url?: string;
  method?: HttpMethod;
  pagination?: boolean;
  showNotification?: boolean;
}

type FetchArgs = Pick<AxiosRequestConfig, 'data' | 'params' | 'url'>;

interface FetcherResult<T> {
  data: T | null;
  fetchData: (args?: FetchArgs) => Promise<{ data: T; hasMoreData: boolean }>;
  hasMorePage: boolean;
  isError: boolean;
  isLoading: boolean;
  isLoadMore: boolean;
}

/**
 * Client Component fetcher for calls the server-side apiFetch() wrapper can't
 * cover (e.g. same-origin proxied endpoints hit directly from the browser).
 * Server Components should use apiFetch() from lib/api/server.ts instead —
 * it participates in the Next.js cache, axios does not.
 */
function useFetcher<T>(config: FetcherConfig = {}): FetcherResult<T> {
  const { pagination = false, showNotification = true } = config;

  const [data, setData] = useState<T | null>(pagination ? ([] as T) : null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(
    config.method === undefined || config.method === HttpMethod.GET,
  );
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [hasMorePage, setHasMorePage] = useState(false);

  const fetchData = async (args?: FetchArgs): Promise<{ data: T; hasMoreData: boolean }> => {
    const fetchConfig: AxiosRequestConfig = {
      method: config.method ?? HttpMethod.GET,
      url: config.url,
      ...args,
    };

    const page = fetchConfig.params?.page as number | undefined;
    const isLoadMorePage = pagination && !!page && page > 1;

    if (!pagination) setData(null);
    if (isLoadMorePage) {
      setIsLoadMore(true);
    } else {
      setIsLoading(true);
    }
    setIsError(false);

    try {
      const response = await axiosInstance.request<ApiResponse<T>>(fetchConfig);
      // 204 No Content responses (e.g. DELETE) have no body to destructure.
      const { data: responseData, meta } = response.data ?? ({} as ApiResponse<T>);

      let hasMoreData = false;
      if (pagination && meta) {
        hasMoreData = meta.page * meta.limit < meta.total;
        setHasMorePage(hasMoreData);
      }

      if (isLoadMorePage && Array.isArray(data) && Array.isArray(responseData)) {
        setData([...data, ...responseData] as T);
      } else {
        setData(responseData);
      }

      return { data: responseData, hasMoreData };
    } catch (err) {
      setIsError(true);
      setData(pagination ? ([] as T) : null);

      const error = err as AxiosError<ApiError>;
      if (showNotification) {
        const message = error.response?.data?.message ?? 'Something went wrong, please try again.';
        toast.error(message);
      }

      throw error.response?.data ?? error;
    } finally {
      setIsLoading(false);
      setIsLoadMore(false);
    }
  };

  return { data, fetchData, hasMorePage, isError, isLoading, isLoadMore };
}

export default useFetcher;
