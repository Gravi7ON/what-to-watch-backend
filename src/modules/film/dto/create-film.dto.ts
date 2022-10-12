import { GenreTypes } from '../../../types/film-type/film-genres.enum.js';

export default class CreateFilmDto {
  public name!: string;
  public posterImage!: string;
  public backgroundImage!: string;
  public backgroundColor!: string;
  public description!: string;
  public director!: string;
  public starring!: string[];
  public runTime!: number;
  public genre!: GenreTypes;
  public released!: number;
  public userId!: string;
  public publishDate!: Date;
  public previewVideoLink!: string;
  public videoLink!: string;
}
