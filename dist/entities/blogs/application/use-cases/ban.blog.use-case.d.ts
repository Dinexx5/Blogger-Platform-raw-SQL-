import { ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/posts.repository';
import { BanBlogModel } from '../../blogs.models';
import { BlogBansRepository } from '../../../bans/bans.blogs.repository';
import { BlogsRepository } from '../../blogs.repository';
export declare class BanBlogCommand {
    blogId: string;
    inputModel: BanBlogModel;
    constructor(blogId: string, inputModel: BanBlogModel);
}
export declare class BansBlogUseCase implements ICommandHandler<BanBlogCommand> {
    protected blogsRepository: BlogsRepository;
    protected postsRepository: PostsRepository;
    protected blogBansRepository: BlogBansRepository;
    constructor(blogsRepository: BlogsRepository, postsRepository: PostsRepository, blogBansRepository: BlogBansRepository);
    execute(command: BanBlogCommand): Promise<boolean>;
}
