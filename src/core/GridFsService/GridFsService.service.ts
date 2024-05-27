import { Injectable } from '@nestjs/common';
import { MongoClient, GridFSBucket, Db } from 'mongodb';
import mongoose from 'mongoose';

@Injectable()
export class GridFsService {
    private readonly client: MongoClient
    private readonly db: Db
    private bucket: GridFSBucket

    constructor() {
        this.client = new MongoClient(process.env.DB_CONNECTION_URL ?? '');
        this.db = this.client.db('web-beer-chat-dev')
        this.initBucket()
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