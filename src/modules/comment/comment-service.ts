import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './comment-service.interface.js';
import { Component } from '../../types/component-types.js';
import { CommentEntity } from './comment-entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { SortType } from '../../types/film-type/sort-type.enum.js';
import { DEFAULT_COMMENT_COUNT } from './comment-constant.js';
import { FilmEntity } from '../film/film-entity.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>
  ) {}

  public async findFilmAndCreateComment(filmId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity> | null> {
    const existedFilm = await this.filmModel.findById(filmId);

    if (!existedFilm) {
      return null;
    }

    const commentWithFilmId = {
      ...dto,
      filmId
    };

    return await this.commentModel.create(commentWithFilmId);
  }

  public async findById(filmId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({filmId})
      .limit(DEFAULT_COMMENT_COUNT)
      .sort({publishDate: SortType.Down})
      .exec();
  }

  public async deleteById(filmId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({filmId})
      .exec();

    return result.deletedCount;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.filmModel
      .exists({_id: documentId})) !== null;
  }
}
