import { BadRequestException, NotFoundException, Scope } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { AuthService, IAuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { IUsersService } from './users.service';

describe('AuthService', () => {
  let service: IAuthService;

  beforeEach(async () => {
    const users: User[] = [];

    const fakeUserService: Partial<IUsersService> = {
      createUser: (newUser: User) => {
        newUser.id = Math.floor(Math.random() * 999999);
        users.push(newUser as User);
        return Promise.resolve(newUser as User);
      },
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      findOne: (id: number) => Promise.resolve({ id: id } as User),
      update: (id: number, attrs: Partial<UpdateUserDto>) =>
        Promise.resolve(null),
      remove: (id: number) => Promise.resolve(null),
    };

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: 'IAuthService',
          useClass: AuthService,
          scope: Scope.DEFAULT,
        },
        {
          provide: 'IUsersService',
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get('IAuthService') as IAuthService;
  });

  it('can create an instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup(
      Object.assign(new SignUpDto(), {
        email: 'john@service.com',
        age: 33,
        username: 'john',
        password: 'password',
      }),
    );

    expect(user).toBeDefined();
    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();

    expect(user).toEqual(
      expect.objectContaining({
        age: expect.any(Number),
        password: expect.any(String),
        email: 'john@service.com',
        username: 'john',
      }),
    );
  });

  it('succeeds signing-in when the correct credentials are supplied', async () => {
    const newSignupUser = Object.assign(new SignUpDto(), {
      email: 'john@service.com',
      password: 'password',
    });

    await service.signup(plainToClass(SignUpDto, newSignupUser));
    const user = await service.signin(newSignupUser);

    expect(user).toBeDefined();
    expect(user.email).toBe('john@service.com');
  });

  it('throws BadRequestException if user signs up with an email that is in use', async () => {
    const newSignupUser = Object.assign(new SignUpDto(), {
      email: 'john@service.com',
      password: 'password',
    });

    await service.signup(plainToClass(SignUpDto, newSignupUser));

    await expect(
      service.signup(
        Object.assign(new SignUpDto(), {
          email: 'john@service.com',
          password: 'pa$$w0rd',
        }),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws NotFoundException if signin is called with a non-existing email', async () => {
    await expect(
      service.signin(
        Object.assign(new SignUpDto(), {
          email: 'asdf@asdf.com',
          password: 'password',
        }),
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException if signin is called with the wrong password', async () => {
    const newSignupUser = Object.assign(new SignUpDto(), {
      email: 'john@service.com',
      password: 'password',
    });

    await service.signup(plainToClass(SignUpDto, newSignupUser));

    await expect(
      service.signin(
        Object.assign(new SignUpDto(), {
          email: 'john@service.com',
          password: 'pa$$w0rd',
        }),
      ),
    ).rejects.toThrow(NotFoundException);
  });
});
