import { Expose, Transform } from 'class-transformer';

export default class CommentResponse {
  @Expose()
  public filmId!: string;

  @Expose()
  public text!: string ;

  @Expose()
  public filmRating!: string;

  @Expose()
  public publishDate!: string;

  @Expose()
  @Transform((value) => value.obj.userId.toString())
  public userId!: string;
}
