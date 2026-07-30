'use client';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

/**
 * axios instance for Client Components. Access token is kept in an httpOnly
 * cookie the browser can't read, so mutations from the client go through Next.js
 * server actions / route handlers rather than calling the API directly with a
 * bearer token. This instance is for public or same-origin proxied calls.
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});
