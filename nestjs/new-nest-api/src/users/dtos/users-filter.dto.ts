import { IsEmail } from 'class-validator';

export class UsersFilterDto {
  @IsEmail()
  email: string;
}
