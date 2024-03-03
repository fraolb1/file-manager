import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './Model/file.model';
import { FileService } from './services/file.service';
import { FileController } from './controllers/file.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'iamdone',
      database: 'fileManager',
      entities: [File],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([File]),
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class AppModule {}
