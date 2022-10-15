import { Expose, Exclude } from 'class-transformer';

export default class UserResponse {
  @Exclude()
  public _id!: string;

  @Expose()
  public id = this._id;

  @Expose()
  public email!: string ;

  @Expose()
  public userName!: string;

  @Expose()
  public avatar!: string;
}
