import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  dbConfig = {
    synchronize: false,
    autoLoadEntities: true,
  };

  createTypeOrmOptions(): TypeOrmModuleOptions {
    switch (process.env.NODE_ENV) {
      case 'development':
        Object.assign(this.dbConfig, {
          type: 'sqlite',
          database: 'db.sqlite',
          entities: ['**/*.entity.js'],
        });
        break;
      case 'test':
        Object.assign(this.dbConfig, {
          type: 'sqlite',
          database: 'test.sqlite',
          entities: ['**/*.entity.ts'],
          synchronize: true,
        });
        break;
      case 'production':
        Object.assign(this.dbConfig, {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          migrationsRun: true,
          entities: ['**/*.entity.js'],
          ssl: {
            rejectUnauthorized: false,
          },
        });
        break;
      default:
        throw new Error('Unknown environment');
    }

    return this.dbConfig;
  }
}
