import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesController } from './files.controller';

@Module({
  imports: [ConfigModule],
  controllers: [FilesController],
})
export class FilesModule {}
