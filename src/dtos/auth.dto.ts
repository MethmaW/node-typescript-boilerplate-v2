import { IsEmail, IsString, MaxLength, Length } from 'class-validator';

export class CreateUserDto {
  @MaxLength(50)
  @IsString()
  public firstName: string;

  @MaxLength(50)
  @IsString()
  public lastName: string;

  @MaxLength(50)
  @IsEmail()
  public email: string;

  @IsString()
  @Length(8, 50)
  public password: string;
}

export class LoginUserDto {
  @MaxLength(50)
  @IsEmail()
  public email: string;

  @IsString()
  @Length(8, 50)
  public password: string;
}

