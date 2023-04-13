import { paginatedViewModel, paginationQuerys } from '../../shared/models/pagination';
import { newestLikes, Post, PostDocument, PostViewModel } from './posts.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BansRepository } from '../bans/bans.repository';
import { PostsLikesRepository } from '../likes/posts.likes.repository';
import { BlogBansRepository } from '../bans/bans.blogs.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

function mapperToPostViewModel(post: PostDocument): PostViewModel {
  return {
    id: post.id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus: post.extendedLikesInfo.myStatus,
      newestLikes: post.extendedLikesInfo.newestLikes,
    },
  };
}

export class PostsQueryRepository {
  constructor(
    protected bansRepository: BansRepository,
    protected postsLikesRepository: PostsLikesRepository,
    protected blogBansRepository: BlogBansRepository,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async getAllPosts(
    query: paginationQuerys,
    blogId?: string,
    userId?: string | null,
  ): Promise<paginatedViewModel<PostViewModel[]>> {
    const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;

    const skippedPostsNumber = (+pageNumber - 1) * +pageSize;
    const bannedPostsFromUsers = await this.bansRepository.getBannedPosts();
    const bannedPosts = await this.blogBansRepository.getBannedPosts();
    const allBannedPosts = bannedPosts.concat(bannedPostsFromUsers);

    const subQuery = `"id" ${allBannedPosts.length ? `NOT IN (${allBannedPosts})` : `IS NOT NULL`} 
    AND (${blogId ? `"blogId" = ${blogId}` : true})`;

    const selectQuery = `SELECT *
                    FROM "Posts"
                    WHERE ${subQuery}
                    ORDER BY 
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
    const counterQuery = `SELECT COUNT(*)
                    FROM "Posts" 
                    WHERE ${subQuery}`;

    const counter = await this.dataSource.query(counterQuery);
    const count = counter[0].count;
    const posts = await this.dataSource.query(selectQuery, [
      sortDirection,
      pageSize,
      skippedPostsNumber,
    ]);
    await this.countLikesForPosts(posts, userId);

    const postsView = posts.map(mapperToPostViewModel);
    return {
      pagesCount: Math.ceil(+count / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +count,
      items: postsView,
    };
  }
  async countLikesForPosts(posts: PostDocument[], userId?: string) {
    for (const post of posts) {
      const foundLikes = await this.postsLikesRepository.findLikesForPost(post.id.toString());
      const threeLatestLikes = await this.postsLikesRepository.findThreeLatestLikes(
        post.id.toString(),
      );
      if (userId) {
        const likeOfUser = foundLikes.find((like) => like.userId === userId);
        const likeStatus = likeOfUser.likeStatus;
        post.extendedLikesInfo.myStatus = likeStatus;
      }
      const likesCount = foundLikes.filter((like) => like.likeStatus === 'Like').length;
      const dislikesCount = foundLikes.filter((like) => like.likeStatus === 'Dislike').length;
      post.extendedLikesInfo.likesCount = likesCount;
      post.extendedLikesInfo.dislikesCount = dislikesCount;
      const newestLikes: newestLikes[] = [];
      newestLikes.push(...threeLatestLikes);
      post.extendedLikesInfo.newestLikes = newestLikes;
    }
  }
  async countLikesForPost(post: PostDocument, userId?: string) {
    const foundLikes = await this.postsLikesRepository.findLikesForPost(post.id.toString());
    const threeLatestLikes = await this.postsLikesRepository.findThreeLatestLikes(
      post.id.toString(),
    );
    if (userId) {
      const likeOfUser = foundLikes.find((like) => like.userId === userId);
      const likeStatus = likeOfUser.likeStatus;
      post.extendedLikesInfo.myStatus = likeStatus;
    }
    const likesCount = foundLikes.filter((like) => like.likeStatus === 'Like').length;
    const dislikesCount = foundLikes.filter((like) => like.likeStatus === 'Dislike').length;
    post.extendedLikesInfo.likesCount = likesCount;
    post.extendedLikesInfo.dislikesCount = dislikesCount;
    const newestLikes: newestLikes[] = [];
    newestLikes.push(...threeLatestLikes);
    post.extendedLikesInfo.newestLikes = newestLikes;
  }

  async findPostById(postId: string, userId?: string | null): Promise<PostViewModel | null> {
    const bannedPostsFromUsers = await this.bansRepository.getBannedPosts();
    const bannedPosts = await this.blogBansRepository.getBannedPosts();
    const allBannedPosts = bannedPosts.concat(bannedPostsFromUsers);
    const bannedPostsStrings = allBannedPosts.map((postId) => postId.toString());
    const foundPost = await this.dataSource.query(
      `
          SELECT *
          FROM "Posts"
          WHERE "id" = $1
      `,
      [postId],
    );
    if (!foundPost.length) {
      return null;
    }
    if (bannedPostsStrings.includes(foundPost[0].id.toString())) {
      return null;
    }
    await this.countLikesForPost(foundPost, userId);
    return mapperToPostViewModel(foundPost);
  }
}
