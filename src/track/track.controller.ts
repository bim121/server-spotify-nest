import { Controller, Get, Post, Delete, Body, Param, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateTrackDto } from "./dto/create-track-dto";
import { CreateCommentDto } from "./dto/create-comment-dto";
import { TrackService } from "./track.service";

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

    @Post('/comment')
    async addComment(@Body() dto: CreateCommentDto) {
        return this.trackService.addComment(dto);
    }

    @Post('/listen/:id')
    async listen(@Param('id') id: number) {
        return this.trackService.listen(id);
    }
}
