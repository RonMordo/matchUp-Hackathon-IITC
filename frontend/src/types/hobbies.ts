export interface Hobby {
  _id: string;
  name: string;
  icon: string;
  category: string;
  createdAt: string; // or Date if you're not serializing to JSON
  updatedAt: string;
}

export interface CreateHobbyDto {
  name: string;
  icon: string;
  category: string;
}
