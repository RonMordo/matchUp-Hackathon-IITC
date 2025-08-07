import { AuthService } from "./auth.service";
import { EventService } from "./event.service";
import { HobbyService } from "./hobbies.service";
import { MessageService } from "./message.service";
import { NotificationService } from "./notification.service";
import { RatingService } from "./rating.service";
import { RequestService } from "./request.service";
import { UserService } from "./user.service";

export { AuthService } from "./auth.service";
export { EventService } from "./event.service";
export { HobbyService } from "./hobbies.service";
export { MessageService } from "./message.service";
export { NotificationService } from "./notification.service";
export { RatingService } from "./rating.service";
export { RequestService } from "./request.service";
export { UserService } from "./user.service";

export { register, login, logout, getMe } from "./auth.service";

export const Services = {
  Auth: AuthService,
  Event: EventService,
  Hobby: HobbyService,
  Message: MessageService,
  Notification: NotificationService,
  Rating: RatingService,
  Request: RequestService,
  User: UserService,
};

export default Services;
