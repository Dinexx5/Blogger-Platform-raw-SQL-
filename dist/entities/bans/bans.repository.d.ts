import { DataSource } from 'typeorm';
import { createBanModel } from './bans.models';
export declare class BansRepository {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    findBanByUserId(userId: string): Promise<any>;
    createBan(banDto: createBanModel): Promise<any>;
    deleteBan(userId: string): Promise<void>;
    countBannedUsers(): Promise<any>;
    getBannedUsers(): Promise<any[]>;
    getBannedBlogs(): Promise<any[]>;
    getBannedPosts(): Promise<any[]>;
    getBannedComments(): Promise<any[]>;
}
