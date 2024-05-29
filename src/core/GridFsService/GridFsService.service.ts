import { Injectable } from '@nestjs/common';
import { MongoClient, GridFSBucket, Db } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class GridFsService {
    private readonly client: MongoClient
    private readonly db: Db
    private bucket: GridFSBucket

    constructor() {
        this.client = new MongoClient(process.env.DB_CONNECTION_URL ?? '');
        this.db = this.client.db('web-beer-chat-dev')
        this.initBucket()

        cloudinary.config({
            secure: true, 
            cloud_name: 'wb-chat',
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    initBucket() {
        const bucket = new GridFSBucket(this.db, {
            bucketName: 'files'
        })

        this.bucket = bucket
    }

    public getGridFs() {
        return this.bucket
    }
}