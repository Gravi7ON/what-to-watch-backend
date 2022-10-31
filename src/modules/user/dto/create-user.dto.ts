import {
  MaxLength,
  MinLength,
  IsEmail
} from 'class-validator';

export default class CreateUserDto {
  @IsEmail({}, {message: 'Field email must be valid address'})
  public email!: string ;

  public avatar?: string;

  @MinLength(1, {message: 'Minimum userName length must be 1'})
  @MaxLength(15, {message: 'Maximum userName length must be 15'})
  public userName!: string;

  @MinLength(6, {message: 'Minimum password is 6 characters'})
  @MaxLength(12, {message: 'Maximum password is 12 characters'})
  public password!: string;
}
