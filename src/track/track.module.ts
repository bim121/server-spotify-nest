import { Module } from "@nestjs/common";
import { TrackController } from "./track.controller";
import { TrackService } from "./track.service";
import { FileService } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [TrackController],
  providers: [TrackService, FileService, PrismaService],
})
export class TrackModule {}
