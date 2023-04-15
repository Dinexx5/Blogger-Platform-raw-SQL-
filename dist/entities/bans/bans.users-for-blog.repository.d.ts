import { Model } from 'mongoose';
import { UserForBlogBanDocument } from './application/domain/bans.schema';
import { DataSource } from 'typeorm';
export declare class UsersBansForBlogRepository {
    private banUserForBlogModel;
    protected dataSource: DataSource;
    constructor(banUserForBlogModel: Model<UserForBlogBanDocument>, dataSource: DataSource);
    createBan(userId: string, login: string, blogId: string, isBanned: boolean, banReason: string, banDate: string, bannedPostsIds: string[]): Promise<void>;
    findBanByBlogAndUserId(blogId: string, userId: string): Promise<any>;
    unbanUser(userId: string, blogId: string): Promise<void>;
    countBannedUsers(): Promise<number>;
    getBannedPostsForUser(userId: string): Promise<any[]>;
    save(instance: any): Promise<void>;
}
