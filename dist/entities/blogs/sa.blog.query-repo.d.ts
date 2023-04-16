import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogSAViewModel } from './blogs.models';
import { DataSource } from 'typeorm';
export declare class BlogsSAQueryRepository {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    mapFoundBlogToBlogViewModel(blog: any): BlogSAViewModel;
    getAllBlogs(query: paginationQuerys): Promise<paginatedViewModel<BlogSAViewModel[]>>;
}
