import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import { User } from '../../types/user-type/user.js';
import { createSHA256 } from '../../utils/common.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.email = data.email;
    this.avatar = data.avatar;
    this.userName = data.userName;
  }

  @prop({
    unique: true,
    required: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
    default: ''
  })
  public email: string;

  @prop({
    match: [/([^s]+(.(?i)(jpg|png))$)/, 'User image must be in .jpg or .png format'],
    default: ''
  })
  public avatar: string | undefined;

  @prop({
    require: true,
    minLength: [1, 'Min length for name is 1'],
    maxLength: [15, 'Max length for name is 15'],
    default: ''
  })
  public userName: string;

  @prop({
    required: true,
    default: '',
    minLength: [6, 'Min length for password is 6'],
    maxLength: [12, 'Max length for password is 12']
  })
  private password!: string;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
