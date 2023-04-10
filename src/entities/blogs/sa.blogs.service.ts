import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './domain/blogs.schema';
import { Model } from 'mongoose';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class SuperAdminBlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected usersRepository: UsersRepository,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}
  async bindBlog(blogId: string, userId: string) {
    const user = await this.usersRepository.findUserById(userId);
    await this.blogsRepository.bindBlogWithUser(blogId, userId, user.login);
  }
}
