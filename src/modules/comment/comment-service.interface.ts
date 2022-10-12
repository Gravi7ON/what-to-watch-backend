import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { CommentEntity } from './comment-entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

export interface CommentServiceInterface {
  create(filmId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findById(filmId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteById(filmId: string): Promise<number | null>;
}