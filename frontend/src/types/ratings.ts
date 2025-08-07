export interface Rating {
  _id: string;
  from: string;
  to: string;
  score: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  event?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRatingDto {
  from: string;
  to: string;
  score: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  event?: string;
}

export interface UpdateRatingDto {
  from?: string;
  to?: string;
  score?: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  event?: string;
}
