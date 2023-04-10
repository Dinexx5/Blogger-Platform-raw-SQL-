import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './domain/blogs.schema';
import { Model } from 'mongoose';
import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogSAViewModel } from './blogs.models';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class BlogsSAQueryRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  mapFoundBlogToBlogViewModel(blog): BlogSAViewModel {
    return {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
      id: blog.id.toString(),
      blogOwnerInfo: {
        userId: blog.userId,
        userLogin: blog.userLogin,
      },
      banInfo: {
        isBanned: blog.isBanned,
        banDate: blog.banDate,
      },
    };
  }
  async getAllBlogs(query: paginationQuerys): Promise<paginatedViewModel<BlogSAViewModel[]>> {
    const {
      sortDirection = 'desc',
      sortBy = 'createdAt',
      pageNumber = 1,
      pageSize = 10,
      searchNameTerm = null,
    } = query;

    const skippedBlogsCount = (+pageNumber - 1) * +pageSize;

    const subQuery = `(${
      searchNameTerm ? `LOWER("name") LIKE '%' || LOWER('${searchNameTerm}') || '%'` : true
    })`;
    const selectQuery = `SELECT blog.*, ban."isBanned",ban."banDate", o."userId", o."userLogin"
                    FROM "Blogs" blog
                    LEFT JOIN "BlogOwnerInfo" o
                    ON blog."id" = o."blogId"
                    LEFT JOIN "BlogBansInfo" ban
                    ON blog."id" = o."blogId"
                    WHERE ${subQuery}
                    ORDER BY 
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
    const counterQuery = `SELECT COUNT(*)
                    FROM "Blogs" blog
                    LEFT JOIN "BlogOwnerInfo" o
                    ON blog."id" = o."blogId"
                    LEFT JOIN "BlogBansInfo" ban
                    ON blog."id" = o."blogId"
                    WHERE ${subQuery}`;

    const counter = await this.dataSource.query(counterQuery);
    const count = counter[0].count;
    const blogs = await this.dataSource.query(selectQuery, [
      sortDirection,
      pageSize,
      skippedBlogsCount,
    ]);

    const blogsView = blogs.map(this.mapFoundBlogToBlogViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: blogsView,
    };
  }
}
