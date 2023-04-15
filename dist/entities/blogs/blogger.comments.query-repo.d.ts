import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogsRepository } from './blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CommentDocument } from '../comments/comments.schema';
import { Model } from 'mongoose';
import { commentsForBloggerViewModel } from '../comments/comments.models';
import { DataSource } from 'typeorm';
export declare class BloggerCommentsQueryRepository {
    protected blogsRepository: BlogsRepository;
    protected postsRepository: PostsRepository;
    private commentModel;
    protected dataSource: DataSource;
    constructor(blogsRepository: BlogsRepository, postsRepository: PostsRepository, commentModel: Model<CommentDocument>, dataSource: DataSource);
    mapCommentsToViewModel(comment: any): commentsForBloggerViewModel;
    getAllComments(query: paginationQuerys, userId: string): Promise<paginatedViewModel<commentsForBloggerViewModel[]>>;
}
