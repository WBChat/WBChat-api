import { ApiProperty } from "@nestjs/swagger";
import { GridFSFile, ObjectId } from "mongodb";

export class GetFilesByIdsResponse implements GridFSFile {
  @ApiProperty({ type: String })
  _id: ObjectId

  @ApiProperty({ type: Number })
  chunkSize: number

  @ApiProperty({ type: String })
  filename: string

  @ApiProperty({ type: Number })
  uploadDate: Date

  @ApiProperty({ type: Number })
  length: number
}