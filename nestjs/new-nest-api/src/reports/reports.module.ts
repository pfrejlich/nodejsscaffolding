import { Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController],
  exports: [
    {
      provide: 'IReportsService',
      useClass: ReportsService,
      scope: Scope.REQUEST,
    },
  ],
  providers: [
    {
      provide: 'IReportsService',
      useClass: ReportsService,
      scope: Scope.REQUEST,
    },
  ],
})
export class ReportsModule {}
