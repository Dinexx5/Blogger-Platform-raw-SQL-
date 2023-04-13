import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { BlogsRepository } from './blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../comments/comments.schema';
import { Model } from 'mongoose';
import { commentsForBloggerViewModel } from '../comments/comments.models';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class BloggerCommentsQueryRepository {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  mapCommentsToViewModel(comment): commentsForBloggerViewModel {
    return {
      id: comment.id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: comment.likesInfo.myStatus,
      },
      postInfo: {
        id: comment.postInfo.id,
        title: comment.postInfo.title,
        blogId: comment.postInfo.blogId,
        blogName: comment.postInfo.blogName,
      },
    };
  }
  async getAllComments(
    query: paginationQuerys,
    userId: string,
  ): Promise<paginatedViewModel<commentsForBloggerViewModel[]>> {
    const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;
    const skippedBlogsCount = (+pageNumber - 1) * +pageSize;

    const allBlogs = await this.blogsRepository.findBlogsForUser(userId);
    const allPosts = await this.postsRepository.findPostsForUser(allBlogs);

    const selectQuery = `SELECT c.*, ci.*, li*, pi*
                    FROM "Comments" c
                    LEFT JOIN "CommentatorInfo" ci
                    ON c."id" = ci."commentId"
                    LEFT JOIN "LikesInfo" li
                    ON c."id" = li."commentId"
                    LEFT JOIN "PostInfoForComment" pi
                    ON c."id" = pi."commentId"
                    WHERE "postId" ${allPosts.length ? `IN (${allPosts})` : `IS NOT NULL`}
                    ORDER BY 
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
    const counterQuery = `SELECT COUNT(*)
                    FROM "Comments" c
                    LEFT JOIN "CommentatorInfo" ci
                    ON c."id" = ci."commentId"
                    LEFT JOIN "LikesInfo" li
                    ON c."id" = li."commentId"
                    LEFT JOIN "PostInfoForComment" pi
                    ON c."id" = pi."commentId"
                    WHERE "postId" ${allPosts.length ? `IN (${allPosts})` : `IS NOT NULL`}`;

    const counter = await this.dataSource.query(counterQuery);
    const count = counter[0].count;
    const comments = await this.dataSource.query(selectQuery, [
      sortDirection,
      pageSize,
      skippedBlogsCount,
    ]);

    const commentsView = comments.map(this.mapCommentsToViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: commentsView,
    };
  }
}
