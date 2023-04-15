import { PostsRepository } from './posts.repository';
import { createPostModel, PostViewModel, updatePostModel } from './posts.schema';
import { CommentsService } from '../comments/comments.service';
import { UsersRepository } from '../users/users.repository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsLikesRepository } from '../likes/posts.likes.repository';
import { UsersBansForBlogRepository } from '../bans/bans.users-for-blog.repository';
import { CommentViewModel, CreateCommentModel } from '../comments/comments.models';
export declare class PostsService {
    protected postsRepository: PostsRepository;
    protected blogsRepository: BlogsRepository;
    protected commentsService: CommentsService;
    protected usersRepository: UsersRepository;
    protected postsLikesRepository: PostsLikesRepository;
    protected usersBansForBlogsRepo: UsersBansForBlogRepository;
    constructor(postsRepository: PostsRepository, blogsRepository: BlogsRepository, commentsService: CommentsService, usersRepository: UsersRepository, postsLikesRepository: PostsLikesRepository, usersBansForBlogsRepo: UsersBansForBlogRepository);
    createPost(postBody: createPostModel, blogId: string, userId: string): Promise<PostViewModel | null>;
    deletePostById(postId: string, blogId: string, userId: string): Promise<void>;
    updatePostById(postBody: updatePostModel, postId: string, blogId: string, userId: string): Promise<void>;
    createComment(postId: string, inputModel: CreateCommentModel, userId: string): Promise<CommentViewModel | null>;
    likePost(postId: string, likeStatus: string, userId: string): Promise<boolean>;
}
