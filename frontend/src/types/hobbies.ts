export interface Hobby {
  _id: string;
  name: string;
  icon: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHobbyDto {
  name: string;
  icon: string;
  category: string;
}
