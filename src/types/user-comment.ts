import { User } from './user.js';

type UserComment = {
  text: string;
  filmRating: number;
  publishDate?: Date;
  author: User;
}

export type { UserComment };
