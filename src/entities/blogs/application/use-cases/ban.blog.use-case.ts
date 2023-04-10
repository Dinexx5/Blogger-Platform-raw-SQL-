import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import { BlogBan, BlogBanDocument } from '../../../bans/application/domain/bans.schema';
import { Model } from 'mongoose';
import { BanBlogModel } from '../../blogs.models';
import { BlogBansRepository } from '../../../bans/bans.blogs.repository';
import { BlogsRepository } from '../../blogs.repository';
import { Blog, BlogDocument } from '../../domain/blogs.schema';
import { NotFoundException } from '@nestjs/common';

export class BanBlogCommand {
  constructor(public blogId: string, public inputModel: BanBlogModel) {}
}

@CommandHandler(BanBlogCommand)
export class BansBlogUseCase implements ICommandHandler<BanBlogCommand> {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected blogBansRepository: BlogBansRepository,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(BlogBan.name) private blogBanModel: Model<BlogBanDocument>,
  ) {}
  async execute(command: BanBlogCommand): Promise<boolean> {
    const blogId = command.blogId;
    const inputModel = command.inputModel;
    const isBanned = inputModel.isBanned;
    const blog = await this.blogsRepository.findBlogInstance(blogId);
    if (!blog) throw new NotFoundException();
    if (isBanned === true) {
      const isBannedBefore = await this.blogBansRepository.findBanByBlogId(blogId);
      if (isBannedBefore) return;
      const banDate = new Date().toISOString();
      await this.blogsRepository.updateBanInfoForBan(blogId, banDate);
      const bannedPostsIds = await this.postsRepository.findPostsForUser([blogId]);
      await this.blogBansRepository.createBan(blogId, isBanned, bannedPostsIds);
      return;
    }
    const banana = await this.blogBansRepository.findBanByBlogId(blogId);
    if (!banana) {
      return;
    }
    await this.blogsRepository.updateBanInfoForUnban(blogId);
    await this.blogBansRepository.unbanBlog(blogId);
  }
}
