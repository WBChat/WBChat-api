import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from '././files.service'
import { GridFsService } from '../GridFsService/GridFsService.service';

@Module({
    imports: [],
    controllers: [FilesController],
    providers: [FilesService, GridFsService],
})
export class FilesModule {}