import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './domain/blogs.schema';
import mongoose, { Model } from 'mongoose';
import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogViewModel } from './blogs.models';
import { BlogsSAQueryRepository } from './sa.blog.query-repo';
import { BansUserUseCase } from '../bans/application/use-cases/ban.user.use.case.';
import { BansRepository } from '../bans/bans.repository';
import { BlogBansRepository } from '../bans/bans.blogs.repository';

function mapFoundBlogToBlogViewModel(blog: BlogDocument): BlogViewModel {
  return {
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    isMembership: blog.isMembership,
    createdAt: blog.createdAt,
    id: blog._id.toString(),
  };
}

export class BlogsQueryRepository {
  constructor(
    protected bansRepository: BansRepository,
    protected blogBansRepository: BlogBansRepository,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  async getAllBlogs(
    query: paginationQuerys,
    userId?: string,
  ): Promise<paginatedViewModel<BlogViewModel[]>> {
    const {
      sortDirection = 'desc',
      sortBy = 'createdAt',
      pageNumber = 1,
      pageSize = 10,
      searchNameTerm = null,
    } = query;
    const sortDirectionInt: 1 | -1 = sortDirection === 'desc' ? -1 : 1;
    const skippedBlogsCount = (+pageNumber - 1) * +pageSize;
    const bannedBlogsFromUsers = await this.bansRepository.getBannedBlogs();
    const bannedBlogs = await this.blogBansRepository.getBannedBlogs();
    const allBannedBlogs = bannedBlogs.concat(bannedBlogsFromUsers);

    const filter = { _id: { $nin: allBannedBlogs } } as {
      _id: { $nin: mongoose.Types.ObjectId[] };
      name?: { $regex: string; $options: string };
      'blogOwnerInfo.userId'?: string;
    };
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }
    if (userId) {
      filter['blogOwnerInfo.userId'] = userId;
    }

    const countAll = await this.blogModel.countDocuments(filter);
    const blogsDb = await this.blogModel
      .find(filter)
      .sort({ [sortBy]: sortDirectionInt })
      .skip(skippedBlogsCount)
      .limit(+pageSize)
      .lean();

    const blogsView = blogsDb.map(mapFoundBlogToBlogViewModel);
    return {
      pagesCount: Math.ceil(countAll / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: countAll,
      items: blogsView,
    };
  }

  async findBlogById(blogId: string): Promise<BlogViewModel | null> {
    const _id = new mongoose.Types.ObjectId(blogId);
    const bannedBlogsFromUsers = await this.bansRepository.getBannedBlogs();
    const bannedBlogs = await this.blogBansRepository.getBannedBlogs();
    const allBannedBlogs = bannedBlogs.concat(bannedBlogsFromUsers);
    const allBannedBlogsStrings = allBannedBlogs.map((blogId) => blogId.toString());
    const foundBlog: BlogDocument | null = await this.blogModel.findOne({
      _id: _id,
    });
    if (!foundBlog) {
      return null;
    }
    if (allBannedBlogsStrings.includes(foundBlog._id.toString())) {
      return null;
    }
    return mapFoundBlogToBlogViewModel(foundBlog);
  }
}
