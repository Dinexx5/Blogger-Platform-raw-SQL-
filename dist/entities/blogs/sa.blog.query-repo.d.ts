import { BlogDocument } from './domain/blogs.schema';
import { Model } from 'mongoose';
import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogSAViewModel } from './blogs.models';
import { DataSource } from 'typeorm';
export declare class BlogsSAQueryRepository {
    private blogModel;
    protected dataSource: DataSource;
    constructor(blogModel: Model<BlogDocument>, dataSource: DataSource);
    mapFoundBlogToBlogViewModel(blog: any): BlogSAViewModel;
    getAllBlogs(query: paginationQuerys): Promise<paginatedViewModel<BlogSAViewModel[]>>;
}
