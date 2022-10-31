import { Matches } from 'class-validator';

export default class UpdateUserDto {
  @Matches(/.jpg|.png/)
  public avatar!: string | undefined;
}
