import { AuthService } from "./auth";

export { default as axiosInstance } from "../utils/axiosInstance";
export { isAuthenticated } from "../utils/axiosInstance";

export { AuthService } from "./auth";

export { register, login, logout, getMe } from "./auth";

export const Services = {
  Auth: AuthService,
};

export default Services;
