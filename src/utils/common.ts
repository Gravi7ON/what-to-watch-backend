import { TypesGenre} from '../types/film-type/genres.js';
import { Film } from '../types/film-type/film.js';
import { GenreTypes } from '../types/film-type/film-genres.enum.js';

const createFilm = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    name,
    posterImage,
    backgroundImage,
    backgroundColor,
    description,
    rating,
    scoresCount,
    director,
    starring,
    runTime,
    genre,
    released,
    userName,
    email,
    password,
    avatar = 'unknown.jpg',
    publishDate,
    previewVideoLink,
    videoLink
  ] = tokens;

  return {
    name,
    description,
    posterImage,
    backgroundImage,
    backgroundColor,
    publishDate: new Date(publishDate),
    rating: Number.parseFloat(rating),
    scoresCount: Number.parseInt(scoresCount, 10),
    director,
    starring: starring.split(';').map((actorName) => actorName),
    runTime: Number.parseInt(runTime, 10),
    genre: GenreTypes[genre as TypesGenre],
    released: Number.parseInt(released, 10),
    user: {
      userName,
      email,
      password,
      avatar
    },
    previewVideoLink,
    videoLink
  } as Film;
};

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export {createFilm, getErrorMessage};
