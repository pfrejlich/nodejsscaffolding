import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dtos/sign-up.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';

export interface IUsersService {
  createUser(newUser: SignUpDto): Promise<User>;
  findOne(id: number): Promise<User | undefined>;
  find(email: string): Promise<User[]>;
  update(id: number, attrs: Partial<UpdateUserDto>);
  remove(id: number);
}

@Injectable()
export class UsersService implements IUsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(newUser: SignUpDto): Promise<User> {
    const user = this.repo.create(newUser);
    return await this.repo.save(user);
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = await this.repo.findOneBy({ id });
    return user;
  }

  async find(email: string): Promise<User[]> {
    return await this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<UpdateUserDto>) {
    const currentUser = await this.findOne(id);
    Object.assign(currentUser, attrs);
    await this.repo.save(currentUser);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete({ id });
  }
}
