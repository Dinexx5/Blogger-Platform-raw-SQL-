import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogViewModel } from './blogs.models';
import { BansRepository } from '../bans/bans.repository';
import { BlogBansRepository } from '../bans/bans.blogs.repository';
import { DataSource } from 'typeorm';
export declare class BlogsQueryRepository {
    protected bansRepository: BansRepository;
    protected blogBansRepository: BlogBansRepository;
    protected dataSource: DataSource;
    constructor(bansRepository: BansRepository, blogBansRepository: BlogBansRepository, dataSource: DataSource);
    mapFoundBlogToBlogViewModel(blog: any): BlogViewModel;
    getAllBlogs(query: paginationQuerys, userId?: string): Promise<paginatedViewModel<BlogViewModel[]>>;
    findBlogById(blogId: string): Promise<BlogViewModel | null>;
}
