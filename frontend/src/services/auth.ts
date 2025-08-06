import axiosInstance from "../utils/axiosInstance";

// Authentication Service
export const AuthService = {
  register: async ({
    name,
    phone,
    email,
    password,
  }: {
    name: string;
    phone: string;
    email: string;
    password: string;
  }) => {
    return await axiosInstance.post("/auth/register", {
      name,
      phone,
      email,
      password,
    });
  },

  login: async (email: string, password: string) => {
    return await axiosInstance.post("/auth/login", { email, password });
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    document.cookie = "token=; Max-Age=0; path=/";
    return response;
  },

  getMe: () => axiosInstance.get("/auth/me"),
};

export const { register, login, logout, getMe } = AuthService;
