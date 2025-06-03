import { Injectable } from "@nestjs/common";
import { FileService, FileType } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePlaylistDto } from "./dto/playlist.dto";

@Injectable()
export class PlaylistService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileService: FileService
    ) {}

    public async createPlaylist(dto: CreatePlaylistDto, image: Express.Multer.File) {
        const saveImage = await this.fileService.uploadToCloudinary(image, FileType.IMAGE);

        return this.prisma.playlist.create({
            data: {
                name: dto.name,
                description: dto.description,
                coverImage: saveImage.url,
                tracks: { connect: [] }
            },
            include: { tracks: true },
        });
    }

    public async addTrackToPlaylist(playlistId: number, trackId: number) {
        return this.prisma.playlist.update({
            where: { id: playlistId },
            data: {
                tracks: {
                    connect: { id: trackId },
                },
            },
            include: { tracks: true },
        });
    }

    public async getAllPlaylists() {
        return this.prisma.playlist.findMany({
            include: { tracks: true },
        });
    }
}
