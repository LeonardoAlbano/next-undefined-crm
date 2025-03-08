import axios from "axios";

import { env } from "@/env";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

// You can add interceptors or other configuration here
api.interceptors.request.use((config) => {
  // Add any request headers or auth tokens here
  return config;
});