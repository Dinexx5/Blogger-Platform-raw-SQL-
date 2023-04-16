import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogsRepository } from './blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { commentsForBloggerViewModel } from '../comments/comments.models';
import { DataSource } from 'typeorm';
import { CommentsLikesRepository } from '../likes/comments.likes.repository';
export declare class BloggerCommentsQueryRepository {
    protected blogsRepository: BlogsRepository;
    protected postsRepository: PostsRepository;
    protected commentsLikesRepository: CommentsLikesRepository;
    protected dataSource: DataSource;
    constructor(blogsRepository: BlogsRepository, postsRepository: PostsRepository, commentsLikesRepository: CommentsLikesRepository, dataSource: DataSource);
    mapCommentsToViewModel(comment: any): commentsForBloggerViewModel;
    getAllComments(query: paginationQuerys, userId: string): Promise<paginatedViewModel<commentsForBloggerViewModel[]>>;
    countLikesForComments(comments: any, userId: string): Promise<void>;
}
