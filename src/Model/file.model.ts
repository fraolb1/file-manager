import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column({ nullable: true })
  folder: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
