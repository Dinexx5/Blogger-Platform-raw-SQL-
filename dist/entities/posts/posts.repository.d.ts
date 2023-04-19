import { DataSource } from 'typeorm';
export declare class PostsRepository {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string, createdAt: string): Promise<any>;
    findPostInstance(postId: string): Promise<any>;
    deletePost(postId: string): Promise<void>;
    updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<void>;
    findPostsForUser(blogs: string[]): Promise<any>;
    findPostsToGetComments(blogs: string[]): Promise<any>;
}
