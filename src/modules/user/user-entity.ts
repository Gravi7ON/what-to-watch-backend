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
  public avatar?: string;

  @prop({
    require: true,
    default: '',
    minlength: [1, 'Min length for user name is 1 character'],
    maxlength: [15, 'Max length for user name is 15 characters']
  })
  public userName: string;

  @prop({
    required: true
  })
  public password!: string;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
