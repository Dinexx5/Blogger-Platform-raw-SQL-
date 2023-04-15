import { BlogsRepository } from './blogs.repository';
import { BlogDocument } from './domain/blogs.schema';
import { Model } from 'mongoose';
import { UsersRepository } from '../users/users.repository';
export declare class SuperAdminBlogsService {
    protected blogsRepository: BlogsRepository;
    protected usersRepository: UsersRepository;
    private blogModel;
    constructor(blogsRepository: BlogsRepository, usersRepository: UsersRepository, blogModel: Model<BlogDocument>);
    bindBlog(blogId: string, userId: string): Promise<void>;
}
