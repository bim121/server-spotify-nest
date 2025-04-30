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

  public async create(dto: CreateTrackDto, picture: Express.Multer.File, audio: Express.Multer.File) {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);

    const track = await this.prisma.track.create({
      data: {
        ...dto,
        listens: 0,
        audio: audioPath,
        picture: picturePath,
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
        listens: {
          increment: 1,
        },
      },
    });
  }

  public async search(query: string) {
    const tracks = await this.prisma.track.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
    return tracks;
  }
}
