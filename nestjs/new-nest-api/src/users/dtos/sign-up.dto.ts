import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsNumber()
  @Min(18)
  @Max(120)
  @IsOptional()
  age: number;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
