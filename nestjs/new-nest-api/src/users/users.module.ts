import { Module, Scope } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { MiddlewareConsumer } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  exports: [
    {
      provide: 'IUsersService',
      useClass: UsersService,
      scope: Scope.REQUEST,
    },
  ],
  providers: [
    {
      provide: 'IUsersService',
      useClass: UsersService,
      scope: Scope.REQUEST,
    },
    {
      provide: 'IAuthService',
      useClass: AuthService,
      scope: Scope.REQUEST,
    },
    AuthService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CurrentUserInterceptor,
    //   scope: Scope.REQUEST,
    // },
    Reflector,
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // Adding a current user middleware
      .apply(CurrentUserMiddleware)
      .forRoutes('*');
  }
}
