import { BansRepository } from '../bans/bans.repository';
import { DataSource } from 'typeorm';
export declare class PostsLikesRepository {
    protected bansRepository: BansRepository;
    protected dataSource: DataSource;
    constructor(bansRepository: BansRepository, dataSource: DataSource);
    likePost(postId: string, likeStatus: string, userId: string, login: string, createdAt: string): Promise<void>;
    findLikeByPostIdAndUserId(postId: string, userId: string): Promise<any>;
    updateLikeStatus(postId: string, userId: string, likeStatus: string): Promise<void>;
    findLikesForPost(postId: string): Promise<any>;
    findThreeLatestLikes(postId: string): Promise<any>;
}
