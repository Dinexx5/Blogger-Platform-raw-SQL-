import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PostsQueryRepository } from './posts.query-repo';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';
import { BlogsQueryRepository } from '../blogs/blogs.query-repo';
import { CommentsModule } from '../comments/comments.module';
import { BlogsRepository } from '../blogs/blogs.repository';
import { BansUserUseCase } from '../bans/application/use-cases/ban.user.use.case.';
import { BansRepository } from '../bans/bans.repository';
import { DevicesModule } from '../devices/devices.module';
import { TokensModule } from '../tokens/token.module';
import { PostsLikesRepository } from '../likes/posts.likes.repository';
import { BlogBansRepository } from '../bans/bans.blogs.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersBansForBlogRepository } from '../bans/bans.users-for-blog.repository';

@Module({
  imports: [CqrsModule, AuthModule, UsersModule, CommentsModule, DevicesModule, TokensModule],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    BlogsQueryRepository,
    BlogsRepository,
    BansUserUseCase,
    BansRepository,
    PostsLikesRepository,
    BlogBansRepository,
    UsersBansForBlogRepository,
  ],
  controllers: [PostsController],
  exports: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    BlogsQueryRepository,
    BlogsRepository,
    PostsLikesRepository,
  ],
})
export class PostsModule {}
