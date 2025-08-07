export interface Message {
  _id: string;
  recipient: string;
  event?: string;
  subject: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageDto {
  recipient: string;
  event?: string;
  subject: string;
  content: string;
}

export interface UpdateMessageDto {
  recipient?: string;
  event?: string;
  subject?: string;
  content?: string;
}
