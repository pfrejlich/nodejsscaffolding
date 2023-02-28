import { Report } from '../reports/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    type: String,
  })
  email: string;

  @Column({
    nullable: true,
  })
  age: number;

  @Column({
    length: 20,
    nullable: true,
  })
  username: string;

  @Column({
    length: 20,
  })
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
