export interface Request {
  _id: string;
  event: string;
  from: string;
  to: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  message?: string;
  responseMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestDto {
  event: string;
  from: string;
  to: string;
  status?: "pending" | "accepted" | "rejected" | "cancelled";
  message?: string;
  responseMessage?: string;
}

export interface UpdateRequestDto {
  event?: string;
  from?: string;
  to?: string;
  status?: "pending" | "accepted" | "rejected" | "cancelled";
  message?: string;
  responseMessage?: string;
}
