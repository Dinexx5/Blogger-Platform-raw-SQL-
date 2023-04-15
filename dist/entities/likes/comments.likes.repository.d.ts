import { BansRepository } from '../bans/bans.repository';
import { DataSource } from 'typeorm';
export declare class CommentsLikesRepository {
    protected bansRepository: BansRepository;
    protected dataSource: DataSource;
    constructor(bansRepository: BansRepository, dataSource: DataSource);
    likeComment(commentId: string, likeStatus: string, userId: string, createdAt: string): Promise<void>;
    findLikeByCommentIdAndUserId(commentId: string, userId: string): Promise<any>;
    updateLikeStatus(commentId: string, userId: string, likeStatus: string): Promise<void>;
    findLikesForComment(commentId: string): Promise<any>;
}
