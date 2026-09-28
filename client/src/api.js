import axios from 'axios';

// In production (Vercel), calls go to /api on the same domain.
// Locally it falls back to http://localhost:4000.
const base = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL ?? 'http://localhost:4000');
const apiBase = base ? `${base}/api` : '/api';
export const api = axios.create({ baseURL: apiBase, withCredentials: true });

// The access token lives in memory only. The refresh token lives in an httpOnly cookie.
let accessToken = null;
export const setAccessToken = (t) => {
  accessToken = t;
};

api.interceptors.request.use((cfg) => {
  if (accessToken) cfg.headers.Authorization = `Bearer ${accessToken}`;
  return cfg;
});

// One refresh at a time. Refresh tokens rotate, so two parallel calls would kill the session.
let refreshing = null;
export function refreshAccessToken() {
  refreshing ??= axios
    .post(base ? `${base}/api/auth/refresh-token` : '/api/auth/refresh-token', null, { withCredentials: true })
    .then((r) => (accessToken = r.data.accessToken))
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

// If a request fails with 401, get a new access token once and replay the request.
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const req = err.config;
    const isAuthCall = req?.url?.startsWith('/auth/login') || req?.url?.startsWith('/auth/refresh-token');
    if (err.response?.status === 401 && req && !req._retried && !isAuthCall) {
      req._retried = true;
      try {
        await refreshAccessToken();
        return api(req);
      } catch {
        accessToken = null;
      }
    }
    return Promise.reject(err);
  }
);

// Turns an API error into { message, fields: { email: '...', price: '...' } } for forms.
export function readError(err) {
  const data = err.response?.data;
  const fields = {};
  (data?.errors || []).forEach((e) => {
    fields[e.field] = e.message;
  });
  return { message: data?.message || 'Could not reach the server. Check your connection and try again.', fields };
}
