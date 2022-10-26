import {
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export default class UpdateUserDto {
  @Matches(/.jpg|.png/)
  public avatar!: string;

  @MinLength(1, {message: 'Minimum userName length must be 1'})
  @MaxLength(15, {message: 'Maximum userName length must be 15'})
  public userName!: string;
}
