import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { FileModule } from "./file/file.module";
import { TrackModule } from "./track/track.module";
import * as path from "path";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    PrismaModule,
    TrackModule,
    FileModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
