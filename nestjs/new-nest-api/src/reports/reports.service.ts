import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportFilterDto } from './dtos/report-filter.dto';
import { Report } from './report.entity';

export interface IReportsService {
  create(reportDto: CreateReportDto, user: User);
  findOne(id: number): Promise<Report | undefined>;
  getEstimate(filter: ReportFilterDto): Promise<Report[]>;
  changeApproval(id: number, approval: ApproveReportDto): Promise<Report>;
}

@Injectable()
export class ReportsService implements IReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportDto: CreateReportDto, user: User): Promise<Report> {
    const report = this.repo.create(reportDto);
    report.user = user;
    return await this.repo.save(report);
  }

  async findOne(id: number): Promise<Report | undefined> {
    const report = await this.repo.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    return report;
  }

  async getEstimate(filter: ReportFilterDto): Promise<Report[]> {
    let query = this.repo
      .createQueryBuilder()
      // .relation(Report, 'user')
      // .of(Report)
      .select('*')
      .where('approved IS TRUE')
      .andWhere('make = :make', { make: filter.make })
      .andWhere('model = :model', { model: filter.model });

    if (filter.lat) {
      query = query.andWhere('lat - :lat BETWEEN -5 and 5', {
        lat: filter.lat,
      });
    }

    if (filter.lng) {
      query = query.andWhere('lng - :lng BETWEEN -5 and 5', {
        lng: filter.lng,
      });
    }

    if (filter.year) {
      query = query.andWhere('year - :year BETWEEN -3 and 3', {
        year: filter.year,
      });
    }

    filter.mileage = filter.mileage || 0;

    query = query
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage: filter.mileage })
      .limit(3);

    return await await query.getRawMany();
  }

  async changeApproval(
    id: number,
    approval: ApproveReportDto,
  ): Promise<Report> {
    const report = await this.findOne(id);
    console.log(report);

    if (!report) {
      throw new NotFoundException(`No report found for supplied id: ${id}`);
    }
    report.approved = approval.approved;

    return await this.repo.save(report);
  }
}
