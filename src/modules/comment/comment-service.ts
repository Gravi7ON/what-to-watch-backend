import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './comment-service.interface.js';
import { Component } from '../../types/component-types.js';
import { CommentEntity } from './comment-entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { SortType } from '../../types/film-type/sort-type.enum.js';
import { DEFAULT_COMMENT_COUNT } from './comment-constant.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(filmId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const commentWithFilmId = {
      ...dto,
      filmId
    };
    const result = await this.commentModel.create(commentWithFilmId);

    return result;
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
}
