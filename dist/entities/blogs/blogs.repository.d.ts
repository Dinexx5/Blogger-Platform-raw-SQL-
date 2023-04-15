import { DataSource } from 'typeorm';
export declare class BlogsRepository {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    createBlog(name: string, description: string, websiteUrl: string, isMembership: boolean, createdAt: string, userId: string, login: string): Promise<any>;
    findBlogInstance(blogId: string): Promise<any>;
    findBlogOwnerInfo(blogId: string): Promise<any>;
    updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<void>;
    updateBanInfoForBan(blogId: string, banDate: string): Promise<void>;
    updateBanInfoForUnban(blogId: string): Promise<void>;
    bindBlogWithUser(blogId: string, userId: string, login: string): Promise<void>;
    deleteBlog(blogId: string): Promise<void>;
    findBlogsForUser(userId: string): Promise<any>;
}
