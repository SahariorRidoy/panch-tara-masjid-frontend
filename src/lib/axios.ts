import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && !original.url?.includes("/auth/login")) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        document.cookie = `accessToken=${data.data.accessToken}; path=/`;
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        document.cookie = "accessToken=; Max-Age=0; path=/";
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
