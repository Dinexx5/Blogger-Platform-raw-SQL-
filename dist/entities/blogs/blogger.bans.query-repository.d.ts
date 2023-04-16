import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { UserForBlogBanDocument } from '../bans/application/domain/bans.schema';
import { BannedForBlogUserViewModel } from '../users/userModels';
import { BlogsRepository } from './blogs.repository';
import { DataSource } from 'typeorm';
export declare class BloggerBansQueryRepository {
    protected blogsRepository: BlogsRepository;
    protected dataSource: DataSource;
    constructor(blogsRepository: BlogsRepository, dataSource: DataSource);
    mapFoundBansToViewModel(ban: UserForBlogBanDocument): BannedForBlogUserViewModel;
    getAllBannedUsersForBlog(query: paginationQuerys, blogId: string, userId: string): Promise<paginatedViewModel<BannedForBlogUserViewModel[]>>;
}
