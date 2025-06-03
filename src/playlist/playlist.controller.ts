import { Controller, Get, Post, Delete, Body, Param, Query, UploadedFiles, UseInterceptors, UseGuards, Req } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { PlaylistService } from "./playlist.service";
import { CreatePlaylistDto } from "./dto/playlist.dto";

@Controller('/playlists')
export class PlaylistController {
    constructor(private readonly playlistService: PlaylistService) {}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
    ]))
    public async create(
        @UploadedFiles() files: { image?: Express.Multer.File[] },
        @Body() dto: CreatePlaylistDto
    ) {
        const image = files.image?.[0];
        console.log(image)
        return this.playlistService.createPlaylist(dto, image);
    }

    @Post(':playlistId/tracks/:trackId')
    public async addTrackToPlaylist(
        @Param('playlistId') playlistId: string,
        @Param('trackId') trackId: string,
    ) {
        return this.playlistService.addTrackToPlaylist(+playlistId, +trackId);
    }

    @Get()
    getAll() {
        return this.playlistService.getAllPlaylists();
    }
}
