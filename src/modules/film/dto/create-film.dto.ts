import {
  MaxLength,
  MinLength,
  IsMongoId,
  IsEnum,
  IsInt,
  Contains,
  IsDateString,
  IsArray,
  IsString
} from 'class-validator';
import { GenreTypes } from '../../../types/film-type/film-genres.enum.js';

export default class CreateFilmDto {
  @MinLength(2, {message: 'Minimum title length must be 2'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public name!: string;

  @Contains('.jpg')
  public posterImage!: string;

  @Contains('.jpg')
  public backgroundImage!: string;

  public backgroundColor!: string;

  @MinLength(20, {message: 'Minimum description length must be 2'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @MinLength(2, {message: 'Minimum director length must be 2'})
  @MaxLength(50, {message: 'Maximum director length must be 50'})
  public director!: string;

  @IsArray({message: 'Field starring must be an array'})
  @IsString({each: true, message: 'Field starring must be an array of valid string'})
  public starring!: string[];

  @IsInt({message: 'Field runTime must be an integer'})
  public runTime!: number;

  @IsEnum(GenreTypes, {message: 'type must be GenreTypes'})
  public genre!: GenreTypes;

  @IsInt({message: 'Field released must be an integer'})
  public released!: number;

  @IsMongoId({message: 'Field userId field must be valid an id'})
  public userId!: string;

  @IsDateString({}, {message: 'Field publishDate must be valid ISO date'})
  public publishDate!: Date;

  public previewVideoLink!: string;

  public videoLink!: string;
}
