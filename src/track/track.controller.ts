import { Controller, Get } from "@nestjs/common";
import { Post } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { Body } from "@nestjs/common/decorators/http/route-params.decorator";
import { CreateTrackDto } from "./dto/create-track-dto";
import { TrackService } from "./track.service";


@Controller('/tracks')
export class TrackController{
    constructor(private trackService: TrackService){

    }
    @Post()
    create(@Body() dto: CreateTrackDto){
        return this.trackService.create(dto);
    }

    @Get()
    getAll(){
        return this.trackService.getAll();
    }

    getOne(){

    }

    delete(){
        
    }
}