import { Max, MaxLength, Min, MinLength, IsDateString } from 'class-validator';

export default class CreateCommentDto {
  @MinLength(5, {message: 'Minimum text comment length must be 5'})
  @MaxLength(1024, {message: 'Maximum text comment length must be 1024'})
  public text!: string;

  @Min(1, {message: 'Minimum filmRating is 1'})
  @Max(10, {message: 'Maximum filmRating is 10'})
  public filmRating!: number;

  @IsDateString({}, {message: 'Field publishDate must be valid ISO date'})
  public publishDate?: Date;

  public userId!: string;
}
