import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { IUsersService } from './users.service';
import { IAuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException, Scope } from '@nestjs/common';
import { UsersFilterDto } from './dtos/users-filter.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<IUsersService>;
  let fakeAuthService: Partial<IAuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: async (id: number) => {
        return Promise.resolve({ id, email: 'someone@server.com' } as User);
      },
      find: async (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email: email,
          } as User,
        ]);
      },
      //   remove: async () => {},
      //   update: async () => {},
    };

    fakeAuthService = {
      //   signup: async () => {},
      signin: async (user: SignUpDto) => {
        return Promise.resolve({
          id: 1,
          email: user.email,
          password: user.password,
        });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'IAuthService',
          useValue: fakeAuthService,
        },
        {
          provide: 'IUsersService',
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('can create an instance of UsersController', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers({
      email: 'john@service.com',
    } as UsersFilterDto);

    expect(users).toBeDefined();
    expect(users.length).toBe(1);
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser(1);
    expect(user).toBeDefined();
    expect(user.email).toBe('someone@server.com');
  });

  it('findUser throws NotFoundException if user with given id is not found', async () => {
    fakeUsersService.findOne = async (id: number) => {
      return Promise.resolve(null);
    };
    await expect(controller.findUser(1)).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      {
        email: 'john@server.com',
        password: 'password',
      } as SignInDto,
      session,
    );

    expect(user).toBeDefined();
    expect(session).toBeDefined();
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
