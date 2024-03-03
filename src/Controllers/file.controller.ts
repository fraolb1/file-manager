import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file) {
    const newFile = await this.fileService.uploadFile(file);
    return { id: newFile.id };
  }

  @Post('folder/:folderName')
  async createFolder(@Param('folderName') folderName: string) {
    await this.fileService.createFolder(folderName);
    return { message: `Folder ${folderName} created successfully` };
  }

  @Get('folder/:folderName')
  async listFilesInFolder(@Param('folderName') folderName: string) {
    return this.fileService.listFilesInFolder(folderName);
  }

  @Get(':id')
  async downloadFile(@Param('id') id: number) {
    const file = await this.fileService.downloadFile(id);
    return { file };
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: number) {
    await this.fileService.deleteFile(id);
    return { message: 'File deleted successfully' };
  }
}
