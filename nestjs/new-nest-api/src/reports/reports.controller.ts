import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AdminGuard } from '../guards/admin.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportFilterDto } from './dtos/report-filter.dto';
import { ReportDto } from './dtos/report.dto';
import { IReportsService } from './reports.service';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
// @ApiHeader({
//   name: 'Authorization',
//   description: 'Security header',
// })
@ApiForbiddenResponse({ description: 'Forbidden.' })
@Controller('reports')
@UseGuards(AuthGuard)
@Serialize(ReportDto)
export class ReportsController {
  constructor(
    @Inject('IReportsService') private reportsService: IReportsService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ReportDto,
    description: 'List of cars matching your search criteria',
  })
  async getEstimate(@Query() filter: ReportFilterDto) {
    return await this.reportsService.getEstimate(filter);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    const report = await this.reportsService.create(body, user);
    return report;
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async changeApproval(
    @Param('id') id: number,
    @Body() body: ApproveReportDto,
  ) {
    return await this.reportsService.changeApproval(id, body);
  }
}
