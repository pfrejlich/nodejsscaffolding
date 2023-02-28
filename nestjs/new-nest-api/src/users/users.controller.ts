import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersFilterDto } from './dtos/users-filter.dto';
import { User } from './user.entity';
import { IUsersService } from './users.service';
import {
  projectResponse,
  Serialize,
} from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { BypassAuth } from '../guards/bypassauth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@Serialize(UserDto)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    @Inject('IUsersService') private usersService: IUsersService,
    @Inject('IAuthService') private authService: AuthService,
  ) {}

  @Get('/whoami')
  async whoAmI(@CurrentUser() user: User, @Res() response: any) {
    if (!user) {
      response.status(401).send({ message: 'No session found' });
    } else {
      response.status(200).send(projectResponse(UserDto, user));
    }
  }

  @BypassAuth()
  @Post('/signout')
  async signout(@Session() session: any, @Res() response: any) {
    session.userId = null;
    response.status(200).send({ message: 'Session cleared' });
  }

  @BypassAuth()
  @Post('/signup')
  async createUser(@Body() body: SignUpDto, @Session() session: any) {
    const user = await this.authService.signup(body);
    session.userId = user.id;
    return user;
  }

  @BypassAuth()
  @HttpCode(200)
  @Post('/signin')
  async signin(@Body() body: SignInDto, @Session() session: any) {
    const user = await this.authService.signin(body);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException(`An id must be supplied`);
    }

    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User not found by supplied id: ${id}`);
    }

    return user;
  }

  @Get()
  async findAllUsers(@Query() filter: UsersFilterDto): Promise<User[]> {
    const users = await this.usersService.find(filter.email);

    if (!users) {
      throw new NotFoundException();
    }

    return users;
  }

  @Patch('/:id')
  async updateUser(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateUserDto,
  ) {
    await this.usersService.update(id, body);
  }

  @Delete('/:id')
  async removeUser(@Param('id', new ParseIntPipe()) id: number) {
    await this.usersService.remove(id);
  }
}
