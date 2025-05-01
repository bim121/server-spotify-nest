import { Injectable } from "@nestjs/common";
import { FileService, FileType } from "src/file/file.service";
import { CreateCommentDto } from "./dto/create-comment-dto";
import { CreateTrackDto } from "./dto/create-track-dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TrackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService
  ) {}

  public async create(dto: CreateTrackDto, image: Express.Multer.File, audio: Express.Multer.File) {
    const saveAudio = await this.fileService.createFile(FileType.AUDIO, audio);
    const saveImage = await this.fileService.createFile(FileType.IMAGE, image);

    const track = await this.prisma.track.create({
      data: {
        ...dto,
        popularity: 0,
        audio: saveAudio.filePath,
        image: saveImage.filePath,
        duration: saveAudio.duration
      },
    });

    return track;
  }

  public async getAll(count = 10, offset = 0) {
    const tracks = await this.prisma.track.findMany({
      skip: Number(offset),
      take: Number(count),
    });
    return tracks;
  }

  public async getOne(id: number) {
    const track = await this.prisma.track.findUnique({
      where: { id: Number(id) },
      include: {
        comments: true,
      },
    });
    return track;
  }

  public async delete(id: number) {
    const track = await this.prisma.track.delete({
      where: { id },
    });
    return track.id;
  }

  public async addComment(dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        username: dto.username,
        text: dto.text,
        track: {
          connect: { id: dto.trackId },
        },
      },
    });
    return comment;
  }

  public async listen(id: number) {
    await this.prisma.track.update({
      where: { id },
      data: {
        popularity: {
          increment: 1,
        },
      },
    });
  }

  public async search(query: string) {
    const tracks = await this.prisma.track.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
    return tracks;
  }
}
