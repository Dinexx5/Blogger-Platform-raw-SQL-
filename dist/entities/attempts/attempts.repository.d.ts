import { DataSource } from 'typeorm';
export declare class AttemptsRepository {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    addNewAttempt(requestData: string, date: string): Promise<void>;
    countAttempts(requestData: string, tenSecondsAgo: string): Promise<any>;
}
