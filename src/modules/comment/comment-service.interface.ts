import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';
import { CommentEntity } from './comment-entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

export interface CommentServiceInterface extends DocumentExistsInterface {
  findFilmAndCreateComment(filmId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity> | null>;
  findById(filmId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteById(filmId: string): Promise<number | null>;
}
