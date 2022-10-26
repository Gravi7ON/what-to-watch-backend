import {
  IsEmail,
  MinLength,
  MaxLength
} from 'class-validator';

export default class LoginUserDto {
  @IsEmail({}, {message: 'Field email must be valid address'})
  public email!: string ;

  @MinLength(6, {message: 'Minimum password is 6 characters'})
  @MaxLength(12, {message: 'Maximum password is 12 characters'})
  public password!: string;
}
