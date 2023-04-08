import { BlogsRepository } from './blogs.repository';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, createBlogModel, updateBlogModel } from './domain/blogs.schema';
import mongoose, { Model } from 'mongoose';
import { UsersRepository } from '../users/users.repository';
import { BlogViewModel } from './blogs.models';

@Injectable()
export class BlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected usersRepository: UsersRepository,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  async createBlog(inputModel: createBlogModel, userId: string): Promise<BlogViewModel> {
    const user = await this.usersRepository.findUserById(userId);
    const isMembership = false;
    const createdAt = new Date().toISOString();
    const createdBlog = await this.blogsRepository.createBlog(
      inputModel.name,
      inputModel.description,
      inputModel.websiteUrl,
      isMembership,
      createdAt,
      user.id.toISOString(),
      user.login,
    );
    return {
      name: createdBlog.name,
      description: createdBlog.description,
      websiteUrl: createdBlog.websiteUrl,
      isMembership: createdBlog.isMembership,
      createdAt: createdBlog.createdAt,
      id: createdBlog.id.toString(),
    };
  }
  async deleteBlogById(blogId: string, userId: string) {
    const blog = await this.blogsRepository.findBlogInstance(blogId);
    if (!blog) throw new NotFoundException();
    const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blogId);
    if (blogOwnerInfo.userId.toString() !== userId) throw new ForbiddenException();
    await this.blogsRepository.deleteBlog(blogId);
  }

  async UpdateBlogById(blogBody: updateBlogModel, blogId: string, userId: string) {
    const { name, description, websiteUrl } = blogBody;
    const blog = await this.blogsRepository.findBlogInstance(blogId);
    const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blogId);
    if (!blog) throw new NotFoundException();
    if (blogOwnerInfo.userId.toString() !== userId) throw new ForbiddenException();
    await this.blogsRepository.updateBlog(blog.id.toISOString(), name, description, websiteUrl);
  }
}
