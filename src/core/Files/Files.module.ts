import { Module, forwardRef } from '@nestjs/common';
import { FilesController } from './Files.controller';
import { FilesService } from './Files.service'
import { GridFsService } from '../GridFsService/GridFsService.service';
import { AuthModule } from '../Auth/Auth.module';

@Module({
    imports: [forwardRef(() => AuthModule),],
    controllers: [FilesController],
    providers: [FilesService, GridFsService],
})
export class FilesModule {}