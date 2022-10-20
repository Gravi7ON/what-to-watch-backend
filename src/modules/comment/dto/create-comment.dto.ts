export default class CreateCommentDto {
  public text!: string;
  public filmRating!: number;
  public publishDate?: Date;
  public userId!: string;
}
