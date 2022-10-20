import {
  Max,
  Min,
  IsEmail
} from 'class-validator';

export default class LoginUserDto {
  @IsEmail({}, {message: 'Field email must be valid address'})
  public email!: string ;

  @Min(6, {message: 'Minimum password is 6 characters'})
  @Max(12, {message: 'Maximum password is 12 characters'})
  public password!: string;
}
