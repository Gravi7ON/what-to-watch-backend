import { Expose, Transform } from 'class-transformer';
import { GenreTypes } from '../../../types/film-type/film-genres.enum.js';

export default class FilmResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public posterImage!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;

  @Expose()
  public description!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public scoresCount!: number;

  @Expose()
  public director!: string;

  @Expose()
  public starring!: string[];

  @Expose()
  public runTime!: number;

  @Expose()
  public genre!: GenreTypes;

  @Expose()
  public released!: number;

  @Expose()
  @Transform((value) => value.obj.userId.toString())
  public userId!: string;

  @Expose()
  public publishDate!: Date;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public videoLink!: string;

  @Expose()
  public isFavorite!: boolean;
}
