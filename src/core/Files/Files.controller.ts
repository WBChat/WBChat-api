import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Response } from 'express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { FilesService } from './files.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { GridFSFile, ObjectId } from 'mongodb'
import { GetFilesByIdsResponse } from './types'

@Controller('/attachment/files')
@ApiTags('Attachments')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file.originalname, file.buffer)
  }

  @Get('get-by-ids')
  @ApiOkResponse({ type: [GetFilesByIdsResponse], status: 200 })
  @ApiQuery({
    name: 'ids',
    required: true,
    type: [String],
  })
  getFiles(@Query() query: {ids: string[] | string}): Promise<GetFilesByIdsResponse[]> {
    const ids = Array.isArray(query.ids) ? query.ids : [query.ids]

    return this.filesService.getFilesByIds(ids.map(id => (new ObjectId(id))))
  }

  @Get('download-file')
  @ApiResponse({ status: 200, description: 'The file has been successfully downloaded.' })
  @ApiResponse({ status: 404, description: 'File not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiQuery({
    name: 'id',
    required: true,
    type: String,
  })
  downloadFile(@Query() query: {id: string}, @Res() res: Response) {
    return this.filesService.downloadFile(res, new ObjectId(query.id))
  }
}
