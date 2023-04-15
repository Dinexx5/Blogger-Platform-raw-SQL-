import { Response } from 'express';
import { DataSource } from 'typeorm';
export declare class TestingController {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    deleteAll(res: Response): Promise<Response<any, Record<string, any>>>;
}
