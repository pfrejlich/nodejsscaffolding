import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { IUsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';

// Convert the callback style scrypt to promise
const scrypt = promisify(_scrypt);

export interface IAuthService {
  signup(user: SignUpDto): Promise<User>;
  signin(currentUser: SignUpDto);
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(@Inject('IUsersService') private usersService: IUsersService) {}

  async signup(user: SignUpDto) {
    const users = await this.usersService.find(user.email);

    if (users.length) {
      throw new BadRequestException(
        `The email ${user.email} is already in use`,
      );
    }

    user.password = await this.hashPassword(user.password);
    const newUser = await this.usersService.createUser(user);

    return newUser;
  }

  async signin(signInUser: SignInDto): Promise<User> {
    const [user] = await this.usersService.find(signInUser.email);

    if (!user) {
      throw new NotFoundException(`Invalid credentials supplied`);
    }

    if (!(await this.isPasswordValid(signInUser.password, user.password))) {
      throw new NotFoundException(`Invalid credentials supplied`);
    }

    return user;
  }

  async isPasswordValid(
    suppliedPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    const [salt, storedHash] = storedPassword.split('.');
    const hash = await this.hashPassword(suppliedPassword, salt);
    const [, newHash] = hash.split('.');
    return storedHash === newHash;
  }

  async hashPassword(
    password: string,
    salt: string = undefined,
  ): Promise<string> {
    const saltValue = salt || randomBytes(8).toString('hex');
    const hash = (await scrypt(password, saltValue, 32)) as Buffer;
    return saltValue + '.' + hash.toString('hex');
  }
}
