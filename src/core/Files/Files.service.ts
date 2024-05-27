import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId, GridFSBucket, GridFSFile } from 'mongodb';
import { Response } from 'express';
import { GridFsService } from '../GridFsService/GridFsService.service';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  private fileModel: GridFSBucket;

  constructor(private readonly gridFsService: GridFsService) {
    this.fileModel = this.gridFsService.getGridFs();
  }

  uploadFile(name: string, fileBuffer: Buffer) {
    return new Promise((resolve) => {
      const uploadStream = this.fileModel.openUploadStream(name)

      const readableStream = new Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null);
  
      readableStream.pipe(uploadStream);
  
      uploadStream.on('finish', () => {
        resolve(uploadStream.id.toString())
      });
    
      uploadStream.on('error', (error) => {
        throw new BadRequestException({
          message: `Error while uploading file: ${error}`,
        })
      });
    })
  }

  downloadFile(res: Response, id: ObjectId): void {
      const downloadStream = this.fileModel.openDownloadStream(id)

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename="downloaded_file"');

      console.log(downloadStream)

      downloadStream.on('data', (chunk) => {
        res.write(chunk)
      });

      downloadStream.on('end', () => {
        res.end()
      });

      downloadStream.on('error', (error) => {
        res.sendStatus(400)
        throw new BadRequestException({
          message: `Error while downloading file: ${error}`,
        });
      });
  }

  async getFilesByIds(ids: ObjectId[]): Promise<GridFSFile[]> {
    const files = await this.fileModel.find({_id: { $in: ids }}).toArray()

    return files
  }
}