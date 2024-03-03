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

  @Post('upload/:folderName')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folderName = req.params.folderName;
          cb(null, `./uploads/${folderName.replace(':', '')}`);
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file,
    @Param('folderName') folderName: string,
  ) {
    const newFile = await this.fileService.uploadFile(file, folderName);
    return { id: newFile.id };
  }

  @Post('folder/:folderName')
  async createFolder(@Param('folderName') folderName: string) {
    try {
      await this.fileService.createFolder(folderName.replace(':', ''));
      return { message: `Folder ${folderName} created successfully` };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('folder/:folderName')
  async listFilesInFolder(@Param('folderName') folderName: string) {
    return this.fileService.listFilesInFolder(folderName.replace(':', ''));
  }

  @Get(':id')
  async downloadFile(@Param('id') id: string) {
    const identification = parseInt(id.replace(':', ''));
    const file = await this.fileService.downloadFile(identification);
    return { file };
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    const identification = parseInt(id.replace(':', ''));
    await this.fileService.deleteFile(identification);
    return { message: 'File deleted successfully' };
  }
}
