import { GenreTypes } from './film-genres.enum.js';
import { User } from './user.js';

type Film = {
  name: string;
  posterImage: string;
  backgroundImage: string;
  backgroundColor: string;
  description: string;
  rating: number;
  scoresCount: number;
  director: string;
  starring: string[];
  runTime: number;
  genre: GenreTypes;
  released: number;
  user: User
  publishDate: Date;
  previewVideoLink: string;
  videoLink: string;
}

export type { Film };
