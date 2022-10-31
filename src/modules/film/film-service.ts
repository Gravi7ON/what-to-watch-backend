import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { FilmServiceInterface } from './film-service.interface.js';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmEntity } from './film-entity.js';
import { Component } from '../../types/component-types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { SortType } from '../../types/film-type/sort-type.enum.js';
import { DEFAULT_FILMS_COUNT } from './film-constant.js';

@injectable()
class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>
  ) {}

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.name}`);

    return result;
  }

  public async findByName(filmName: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findOne({name: filmName})
      .exec();
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return (
      await this.filmModel
        .aggregate([
          {$match: { _id: new Types.ObjectId(filmId)}},
          {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'filmId',
              as: 'comments'
            }
          },
          {
            $addFields: {
              id: {$toString: '$_id'},
              scoresCount: {$size: '$comments'},
              rating: {$ifNull: [{$avg: '$comments.filmRating'}, 0]}
            }
          },
          {$unset: 'comments'}
        ])
        .exec()
    )[0];
  }

  public async findOrCreate(filmName: string, dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const existsFilm = await this.findByName(filmName);

    if (existsFilm) {
      return existsFilm;
    }

    return this.create(dto);
  }

  public async findAllFims(limit = DEFAULT_FILMS_COUNT): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'filmId',
            as: 'comments'
          }
        },
        {
          $addFields: {
            id: {$toString: '$_id'},
            scoresCount: {$size: '$comments'},
            rating: {$ifNull: [{$avg: '$comments.filmRating'}, 0]}
          }
        },
        {$unset: 'comments'},
        {$limit: +limit},
        {$sort: {publishDate: SortType.Down}}
      ])
      .exec();
  }

  public async deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndDelete(filmId)
      .exec();
  }

  public async updateById(filmId: string, dto: CreateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    await this.filmModel.findByIdAndUpdate(filmId, dto);

    return (
      await this.filmModel
        .aggregate([
          {$match: { _id: new Types.ObjectId(filmId)}},
          {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'filmId',
              as: 'comments'
            }
          },
          {
            $addFields: {
              id: {$toString: '$_id'},
              scoresCount: {$size: '$comments'},
              rating: {$ifNull: [{$avg: '$comments.filmRating'}, 0]}
            }
          },
          {$unset: 'comments'}
        ])
        .exec()
    )[0];
  }

  public async findSimilarFilmsByGenre(filmId: string, limit = DEFAULT_FILMS_COUNT): Promise<DocumentType<FilmEntity>[]> {
    const film = await this.findById(filmId)
      .then((movie) => movie);

    return this.filmModel
      .aggregate([
        {$match: {genre: film?.genre}},
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'filmId',
            as: 'comments'
          }
        },
        {
          $addFields: {
            id: {$toString: '$_id'},
            scoresCount: {$size: '$comments'},
            rating: {$ifNull: [{$avg: '$comments.filmRating'}, 0]}
          }
        },
        {$unset: 'comments'},
        {$limit: limit},
        {$sort: {publishDate: SortType.Down}}
      ])
      .exec();
  }

  public async findFavoriteFilms(): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel
      .aggregate([
        {$match: {isFavorite: true}},
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'filmId',
            as: 'comments'
          }
        },
        {
          $addFields: {
            id: {$toString: '$_id'},
            scoresCount: {$size: '$comments'},
            rating: {$ifNull: [{$avg: '$comments.filmRating'}, 0]}
          }
        },
        {$unset: 'comments'},
        {$sort: {publishDate: SortType.Down}}
      ])
      .exec();
  }

  public async changeStatusFavoriteFilms(filmId: string, status: number): Promise<DocumentType<FilmEntity> | null> {
    await this.filmModel.findByIdAndUpdate(filmId, {isFavorite: !!status});

    return (
      await this.filmModel
        .aggregate([
          {$match: { _id: new Types.ObjectId(filmId)}},
          {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'filmId',
              as: 'comments'
            }
          },
          {
            $addFields: {
              id: {$toString: '$_id'},
              scoresCount: {$size: '$comments'},
              rating: {$ifNull: [{$avg: '$comments.filmRating'}, 0]}
            }
          },
          {$unset: 'comments'}
        ])
        .exec()
    )[0];
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.filmModel
      .exists({_id: documentId})) !== null;
  }
}

export default FilmService;
