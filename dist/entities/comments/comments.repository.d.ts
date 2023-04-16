import { DataSource } from 'typeorm';
export declare class CommentsRepository {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    createComment(content: string, createdAt: string, userId: string, userLogin: string, postId: string, title: string, blogId: string, blogName: string): Promise<any>;
    findComment(commentId: string): Promise<any>;
    findCommentatorInfo(commentId: string): Promise<any>;
    updateComment(commentId: string, content: string): Promise<void>;
    deleteComment(commentId: string): Promise<void>;
    findBannedComments(userId: string): Promise<any>;
}
