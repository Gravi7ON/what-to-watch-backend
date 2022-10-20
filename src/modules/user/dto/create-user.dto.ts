import {
  Max,
  MaxLength,
  Min,
  MinLength,
  IsEmail,
  Contains
} from 'class-validator';

export default class CreateUserDto {
  @IsEmail({}, {message: 'Field email must be valid address'})
  public email!: string ;

  @Contains('.jpg' || '.png')
  public avatar?: string;

  @MinLength(1, {message: 'Minimum userName length must be 1'})
  @MaxLength(15, {message: 'Maximum userName length must be 15'})
  public userName!: string;

  @Min(6, {message: 'Minimum password is 6 characters'})
  @Max(12, {message: 'Maximum password is 12 characters'})
  public password!: string;
}
