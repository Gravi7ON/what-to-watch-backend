import crypto from 'crypto';
import * as jose from 'jose';
import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types.js';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { TypesGenre} from '../types/film-type/genres.js';
import { Film } from '../types/film-type/film.js';
import { GenreTypes } from '../types/film-type/film-genres.enum.js';
import { FilmEntity } from '../modules/film/film-entity.js';
import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../types/validation-error-field.js';
import { ServiceError } from '../types/service-error.enum.js';
import { DEFAULT_STATIC_IMAGES } from '../app/application-constant.js';
import { UnknownObject } from '../types/unknown-object.js';

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

const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});


const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

const dataForUnauthorized = (
  authorizedUser: {
    id: string;
    email: string;
},
  data: (DocumentType<FilmEntity, BeAnObject> | null) | DocumentType<FilmEntity, BeAnObject>[]
) => {
  if (authorizedUser) {
    return;
  }

  if (Array.isArray(data)) {
    return data.map((film) => ({
      ...film,
      isFavorite: false
    }));
  }

  return {
    ...data,
    isFavorite: false
  };
};

const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

const transformObject = (properties: string[], staticPath: string, uploadPath: string, data:UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    }));
};

export {
  createFilm,
  getErrorMessage,
  createSHA256,
  fillDTO,
  createErrorObject,
  createJWT,
  dataForUnauthorized,
  transformErrors,
  getFullServerPath,
  transformProperty,
  transformObject
};
