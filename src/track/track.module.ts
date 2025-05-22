import { Module } from "@nestjs/common";
import { TrackController } from "./track.controller";
import { TrackService } from "./track.service";
import { FileService } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { JwtGuard } from "src/auth/guards/jwt.guard";

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule
  ],
  controllers: [TrackController],
  providers: [TrackService, FileService, PrismaService, JwtGuard],
})
export class TrackModule {}
