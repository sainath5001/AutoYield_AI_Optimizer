import axios from "axios";

/**
 * HTTP client for the AutoYield backend (see NEXT_PUBLIC_API_URL).
 */
/**
 * Avoid default `Content-Type: application/json` on GET — it forces a CORS
 * preflight on cross-origin requests (e.g. Vercel → Render) and can fail if
 * OPTIONS is not handled identically. JSON bodies still set Content-Type via axios.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
});
