import { DataSource } from 'typeorm';
export declare class BlogBansRepository {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    createBan(blogId: string, isBanned: boolean, bannedPostsIds: string[]): Promise<void>;
    unbanBlog(blogId: string): Promise<void>;
    findBanByBlogId(blogId: string): Promise<any>;
    countBannedBlogs(): Promise<any>;
    getBannedBlogs(): Promise<any[]>;
    getBannedPosts(): Promise<any[]>;
}
