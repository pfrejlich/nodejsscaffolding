// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesModule } from '../messages/messages.module';
import { ReportsModule } from '../reports/reports.module';
import { UsersModule } from '../users/users.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmConfigService } from '../config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       entities: [User, Report],
    //       synchronize: true,
    //     };
    //   },
    // }),
    MessagesModule,
    UsersModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [
    {
      // Applies the validation pipeline to every
      // incoming request in controllers
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
  ],
  exports: [],
})
export class SharedModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        // Adding a session middleware
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
