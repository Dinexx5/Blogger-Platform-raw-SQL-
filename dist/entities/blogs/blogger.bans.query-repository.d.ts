import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BannedForBlogUserViewModel } from '../users/userModels';
import { BlogsRepository } from './blogs.repository';
import { DataSource } from 'typeorm';
export declare class BloggerBansQueryRepository {
    protected blogsRepository: BlogsRepository;
    protected dataSource: DataSource;
    constructor(blogsRepository: BlogsRepository, dataSource: DataSource);
    mapFoundBansToViewModel(ban: any): BannedForBlogUserViewModel;
    getAllBannedUsersForBlog(query: paginationQuerys, blogId: string, userId: string): Promise<paginatedViewModel<BannedForBlogUserViewModel[]>>;
}
