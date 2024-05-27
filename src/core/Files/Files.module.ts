import { Module } from '@nestjs/common';
import { FilesController } from './Files.controller';
import { FilesService } from './Files.service'
import { GridFsService } from '../GridFsService/GridFsService.service';

@Module({
    imports: [],
    controllers: [FilesController],
    providers: [FilesService, GridFsService],
})
export class FilesModule {}