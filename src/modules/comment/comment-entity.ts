import typegoose, {getModelForClass, Ref, defaultClasses} from '@typegoose/typegoose';
import { UserEntity } from '../user/user-entity.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends  defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
  })
  public filmId!: string;

  @prop({
    trim: true,
    required: true,
    minLength: [5, 'Min length for comment is 5 characters'],
    maxLength: [1024, 'Max length comment is 1024 characters']
  })
  public text!: string;

  @prop({
    required: true,
    min: 1,
    max: 10,
    default: 1
  })
  public filmRating!: number;

  @prop({
    default: new Date()
  })
  public publishDate!: Date;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
