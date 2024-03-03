import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './Model/file.model';
import { FileService } from './services/file.service';
import { FileController } from './controllers/file.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [File],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([File]),
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class AppModule {}
