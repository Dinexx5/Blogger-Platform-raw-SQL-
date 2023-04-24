import { BlogsRepository } from './blogs.repository';
import { UsersRepository } from '../users/users.repository';
import { BlogViewModel, createBlogModel, updateBlogModel } from './blogs.models';
export declare class BlogsService {
    protected blogsRepository: BlogsRepository;
    protected usersRepository: UsersRepository;
    constructor(blogsRepository: BlogsRepository, usersRepository: UsersRepository);
    createBlog(inputModel: createBlogModel, userId: string): Promise<BlogViewModel>;
    deleteBlogById(blogId: string, userId: string): Promise<void>;
    UpdateBlogById(blogBody: updateBlogModel, blogId: string, userId: string): Promise<void>;
}
