import { BlogsRepository } from './blogs.repository';
import { UsersRepository } from '../users/users.repository';
export declare class SuperAdminBlogsService {
    protected blogsRepository: BlogsRepository;
    protected usersRepository: UsersRepository;
    constructor(blogsRepository: BlogsRepository, usersRepository: UsersRepository);
    bindBlog(blogId: string, userId: string): Promise<void>;
}
