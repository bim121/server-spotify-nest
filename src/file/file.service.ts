import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import * as mm from 'music-metadata';
import * as streamifier from 'streamifier';

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
}

@Injectable()
export class FileService {
  async uploadToCloudinary(file: Express.Multer.File, type: FileType): Promise<{ url: string, duration?: string }> {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { resource_type: type === FileType.AUDIO ? 'video' : 'image', folder: type },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(upload);
      });

      if (type === FileType.AUDIO) {
       const metadata = await mm.parseBuffer(new Uint8Array(file.buffer), file.mimetype);
        const durationInSeconds = metadata.format.duration ?? 0;
        const formattedDuration = this.formatDuration(durationInSeconds);

        return { url: result.secure_url, duration: formattedDuration };
      }

      return { url: result.secure_url };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
