import { UsersRepository } from '../../../users/users.repository';
import { BanUserModelForBlog } from '../../../users/userModels';
import { BlogsRepository } from '../../../blogs/blogs.repository';
import { PostsRepository } from '../../../posts/posts.repository';
import { ICommandHandler } from '@nestjs/cqrs';
import { UsersBansForBlogRepository } from '../../../bans/bans.users-for-blog.repository';
export declare class BanUserForBlogCommand {
    userId: string;
    inputModel: BanUserModelForBlog;
    ownerId: string;
    constructor(userId: string, inputModel: BanUserModelForBlog, ownerId: string);
}
export declare class BanUserForBlogUseCase implements ICommandHandler<BanUserForBlogCommand> {
    protected usersRepository: UsersRepository;
    protected postsRepository: PostsRepository;
    protected blogsRepository: BlogsRepository;
    protected usersBansForBlogsRepository: UsersBansForBlogRepository;
    constructor(usersRepository: UsersRepository, postsRepository: PostsRepository, blogsRepository: BlogsRepository, usersBansForBlogsRepository: UsersBansForBlogRepository);
    execute(command: BanUserForBlogCommand): Promise<boolean>;
}
