import { Module } from "@nestjs/common";
import { FileService } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { PlaylistService } from "./playlist.service";
import { PlaylistController } from "./playlist.controller";

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService, FileService, PrismaService, JwtGuard],
})
export class PlaylistModule {}