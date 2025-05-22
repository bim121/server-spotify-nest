import { Controller, Get, Post, Delete, Body, Param, Query, UploadedFiles, UseInterceptors, UseGuards, Req } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateTrackDto } from "./dto/create-track-dto";
import { CreateCommentDto } from "./dto/create-comment-dto";
import { TrackService } from "./track.service";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { AuthRequest } from "src/types/express";

@Controller('/tracks')
export class TrackController {
    constructor(private readonly trackService: TrackService) {}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
    ]))
    async create(
        @UploadedFiles() files: { image?: Express.Multer.File[], audio?: Express.Multer.File[] },
        @Body() dto: CreateTrackDto
    ) {
        const image = files.image?.[0];
        const audio = files.audio?.[0];
        return this.trackService.create(dto, image, audio);
    }

    @UseGuards(JwtGuard)
    @Post('/comment/:trackId')
    async createComment(
        @Param('trackId') trackId: number,
        @Body('text') text: string,
        @Req() req: AuthRequest
    ) {
        const userId = req.user['userId']; 
        return this.trackService.createComment(trackId, userId, text);
    }

    @Get()
    async getAll(
        @Query('count') count?: number,
        @Query('offset') offset?: number,
    ) {
        return this.trackService.getAll(count, offset);
    }

    @Get('/search')
    async search(@Query('query') query: string) {
        return this.trackService.search(query);
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        return this.trackService.getOne(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.trackService.delete(id);
    }

    @Post('/listen/:id')
    async listen(@Param('id') id: number) {
        return this.trackService.listen(id);
    }
}
