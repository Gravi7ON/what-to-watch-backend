import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user-entity.js';
import { GenreTypes } from '../../types/film-type/film-genres.enum.js';

const {prop, modelOptions} = typegoose;

export interface FilmEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'films'
  }
})
export class FilmEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    minlength: [2, 'Min length for film name is 2 characters'],
    maxlength: [100,'Max length for film name is 100 characters'],
    trim: true
  })
  public name!: string;

  @prop({
    required:true,
    minlength: [20, 'Min length for description is 20 charactes'],
    maxlength: [1024, 'Max length for description is 1024 characters'],
    trim: true
  })
  public description!: string;

  @prop({
    required: true
  })
  public publishDate!: Date;

  @prop({
    type: () => String,
    required: true,
    enum: GenreTypes
  })
  public genre!: GenreTypes;

  @prop({
    required: true,
  })
  public released!: number;

  @prop({
    required: true,
  })
  public previewVideoLink!: string;

  @prop({
    required: true,
  })
  public videoLink!: string;

  @prop({
    required: true,
    default: []
  })
  public starring!: string[];

  @prop({
    required: true,
    default: 0
  })
  public rating!: number;

  @prop({
    required: true,
    minlength: [2, 'Min length for director is 2 characters'],
    maxlength: [50, 'Max length for director is 50 characters']
  })
  public director!: string;

  @prop({
    required: true,
  })
  public runTime!: number;

  @prop({
    required: true,
    default: 0
  })
  public scoresCount!: number;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;

  @prop({
    required: true,
  })
  public backgroundColor!: string;

  @prop({
    required: true,
    match: [/([^s]+(.(?i)(jpg))$)/, 'User image must be in .jpg format'],
    default: ''
  })
  public posterImage!: string;

  @prop({
    required: true,
    match: [/([^s]+(.(?i)(jpg))$)/, 'User image must be in .jpg format'],
    default: ''
  })
  public backgroundImage!: string;
}

export const FilmModel = getModelForClass(FilmEntity);
