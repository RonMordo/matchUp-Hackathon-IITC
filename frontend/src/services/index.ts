import { AuthService } from "./auth.service";
import { EventService } from "./event.service";

export { AuthService } from "./auth.service";
export { EventService } from "./event.service";

export { register, login, logout, getMe } from "./auth.service";

export const Services = {
  Auth: AuthService,
};

export default Services;
