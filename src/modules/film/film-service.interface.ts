import { DocumentType } from '@typegoose/typegoose';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmEntity } from './film-entity.js';

export interface FilmServiceInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findByName(filmName: string): Promise<DocumentType<FilmEntity> | null>;
  findById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  findOrCreate(filmName: string, dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findAllFims(): Promise<DocumentType<FilmEntity>[]>;
  deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  updateById(filmId: string, dto: CreateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  findSimilarFilmsByGenre(genre: string, limit: number): Promise<DocumentType<FilmEntity>[]>;
  findFavoriteFilms(): Promise<DocumentType<FilmEntity>[]>;
  changeStatusFavoriteFilms(filmId: string, status: number): Promise<DocumentType<FilmEntity> | null>;
}
