import { CommentsRepository } from './comments.repository';
import { UsersRepository } from '../users/users.repository';
import { CommentsLikesRepository } from '../likes/comments.likes.repository';
import { CommentViewModel, CreateCommentModel } from './comments.models';
import { PostsRepository } from '../posts/posts.repository';
export declare class CommentsService {
    protected commentsRepository: CommentsRepository;
    protected postsRepository: PostsRepository;
    protected usersRepository: UsersRepository;
    protected commentsLikesRepository: CommentsLikesRepository;
    constructor(commentsRepository: CommentsRepository, postsRepository: PostsRepository, usersRepository: UsersRepository, commentsLikesRepository: CommentsLikesRepository);
    createComment(postId: string, inputModel: CreateCommentModel, userId: string): Promise<CommentViewModel>;
    updateCommentById(commentId: string, inputModel: CreateCommentModel, userId: string): Promise<void>;
    deleteCommentById(commentId: string, userId: string): Promise<void>;
    likeComment(commentId: string, likeStatus: string, userId: string): Promise<boolean>;
}
