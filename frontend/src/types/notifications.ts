export interface Notification {
  _id: string;
  recipient: string;
  type: "message" | "request";
  from?: string;
  event?: string;
  message?: string;
  request?: string;
  status: "unread" | "read" | "archived";
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationDto {
  recipient: string;
  type: "message" | "request";
  from?: string;
  event?: string;
  message?: string;
  request?: string;
  status?: "unread" | "read" | "archived";
  content: string;
}

export interface UpdateNotificationDto {
  recipient?: string;
  type?: "message" | "request";
  from?: string;
  event?: string;
  message?: string;
  request?: string;
  status?: "unread" | "read" | "archived";
  content?: string;
}
