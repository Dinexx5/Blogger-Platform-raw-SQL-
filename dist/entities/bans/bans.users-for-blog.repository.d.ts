import { DataSource } from 'typeorm';
export declare class UsersBansForBlogRepository {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    createBan(userId: string, login: string, blogId: string, isBanned: boolean, banReason: string, banDate: string, bannedPostsIds: string[]): Promise<void>;
    findBanByBlogAndUserId(blogId: string, userId: string): Promise<any>;
    unbanUser(userId: string, blogId: string): Promise<void>;
    countBannedUsers(): Promise<any>;
    getBannedPostsForUser(userId: string): Promise<any[]>;
}
