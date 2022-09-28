import typegoose, {getModelForClass, defaultClasses, Severity} from '@typegoose/typegoose';
import { User } from '../../types/user-type/user.js';
import { createSHA256 } from '../../utils/common.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.email = data.email;
    this.avatar = data.avatar as string;
    this.userName = data.userName;
  }

  @prop({
    unique: true,
    required: true,
    default: ''
  })
  public email: string;

  @prop({
    default: 'unknown.jpg',
    match: [/.jpg|.png/, 'Incorrect file format']
  })
  public avatar: string;

  @prop({
    require: true,
    default: '',
    minlength: [1, 'Min length for user name is 1 character'],
    maxlength: [15, 'Min length for user name is 15 characters']
  })
  public userName: string;

  @prop({
    required: true,
    minlength: [6, 'Min length for password is 6 character'],
    maxlength: [12, 'Min length for password is 12 characters']
  })
  public password!: string;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
