import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import * as mm from 'music-metadata'; 
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

export enum FileType{
    AUDIO = 'audio',
    IMAGE = 'image'
}

@Injectable()
export class FileService {
  async createFile(type: FileType, file): Promise<{ filePath: string, duration?: string }> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;

      const filePath = path.resolve(__dirname, '..', 'static', type);
      
      if (!fs.existsSync(filePath)) {
        await fs.promises.mkdir(filePath, { recursive: true });
      }

      await fs.promises.writeFile(path.resolve(filePath, fileName), file.buffer);

      if(type === FileType.AUDIO){
        const fullAudioPath = path.resolve(filePath, fileName);
        const metadata = await mm.parseFile(fullAudioPath);
        const durationInSeconds = metadata.format.duration ?? 0;
        const formattedDuration = this.formatDuration(durationInSeconds);
  
        return { filePath: type + '/' + fileName, duration: formattedDuration };
      }

      return { filePath: type + '/' + fileName }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  removeFile(fileName: string) {
  }
}
