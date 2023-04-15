import { Model } from 'mongoose';
import { BanDocument } from './application/domain/bans.schema';
import { DataSource } from 'typeorm';
import { createBanModel } from './bans.models';
export declare class BansRepository {
    private banModel;
    protected dataSource: DataSource;
    constructor(banModel: Model<BanDocument>, dataSource: DataSource);
    findBanByUserId(userId: string): Promise<any>;
    createBan(banDto: createBanModel): Promise<any>;
    deleteBan(userId: string): Promise<void>;
    countBannedUsers(): Promise<any>;
    getBannedUsers(): Promise<any[]>;
    getBannedBlogs(): Promise<any[]>;
    getBannedPosts(): Promise<any[]>;
    getBannedComments(): Promise<any[]>;
}
