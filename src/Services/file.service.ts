import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../model/file.model';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async findAll(): Promise<File[]> {
    return this.fileRepository.find();
  }

  async uploadFile(file, folder: string): Promise<File> {
    const newFile = new File();
    newFile.filename = file.filename;
    newFile.path = file.path;
    newFile.folder = folder;
    return this.fileRepository.save(newFile);
  }

  async createFolder(folderName: string): Promise<void> {
    const folderPath = join('./uploads', folderName);
    try {
      await mkdir(folderPath, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create folder: ${error.message}`);
    }
  }

  async listFilesInFolder(folderName: string): Promise<any[]> {
    const folderPath = join('./uploads', folderName);
    try {
      const files = await readdir(folderPath);
      const fileDetails = [];
      for (const file of files) {
        const filePath = join(folderPath, file);
        const fileStat = await stat(filePath);
        const fileInfo = await this.fileRepository.findOne({
          where: { filename: file },
        });
        fileDetails.push({
          id: fileInfo.id,
          filename: file,
          size: fileStat.size,
          created_at: fileStat.birthtime,
          modified_at: fileStat.mtime,
        });
      }
      return fileDetails;
    } catch (error) {
      throw new Error(`Failed to list files in folder: ${error.message}`);
    }
  }

  async downloadFile(id: number): Promise<File> {
    return this.fileRepository.findOne({ where: { id } });
  }

  async deleteFile(id: number): Promise<void> {
    await this.fileRepository.delete(id);
  }
}
