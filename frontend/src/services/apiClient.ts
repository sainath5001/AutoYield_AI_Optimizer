import axios from "axios";

/**
 * HTTP client for the AutoYield backend (see NEXT_PUBLIC_API_URL).
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
});
