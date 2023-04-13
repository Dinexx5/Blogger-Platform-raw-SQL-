import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PostLike, PostLikeDocument } from './posts.like.schema';
import { BansRepository } from '../bans/bans.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsLikesRepository {
  constructor(
    protected bansRepository: BansRepository,
    @InjectModel(PostLike.name) private postLikeModel: Model<PostLikeDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async likePost(
    postId: string,
    likeStatus: string,
    userId: string,
    login: string,
    createdAt: string,
  ) {
    const likeQuery = `INSERT INTO "PostsLikes"
                   ("postId", "likeStatus", "userId", login, "createdAt")
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *;`;
    await this.dataSource.query(likeQuery, [postId, likeStatus, userId, login, createdAt]);
  }
  async findLikeByPostIdAndUserId(postId: string, userId: string) {
    const like = await this.dataSource.query(
      `
          SELECT *
          FROM "PostsLikes"
          WHERE "postId" = $1 AND "userId" = $2
      `,
      [postId, userId],
    );
    return like[0];
  }
  async updateLikeStatus(postId: string, userId: string, likeStatus: string) {
    await this.dataSource.query(
      `
          UPDATE "PostsLikes"
          SET "likeStatus"= $3
          WHERE "postId" = $1 AND "userId" = $2
      `,
      [postId, userId, likeStatus],
    );
  }
  async findLikesForPost(postId: string) {
    const bannedUsers = await this.bansRepository.getBannedUsers();
    const likes = await this.dataSource.query(
      `
          SELECT *
          FROM "PostsLikes"
          WHERE "postId" = $1 AND "userId" NOT IN ${bannedUsers}
      `,
      [postId],
    );
    return likes;
  }
  async findThreeLatestLikes(postId: string) {
    const bannedUsers = await this.bansRepository.getBannedUsers();
    const allLikes = await this.dataSource.query(
      `
          SELECT *
          FROM "PostsLikes"
          WHERE "postId" = $1 AND "userId" NOT IN ${bannedUsers}
      `,
      [postId],
    );
    const threeLatestLikes = allLikes.slice(0, 3);
    const mappedThreeLatestLikes = threeLatestLikes.map((like) => {
      return {
        addedAt: like.createdAt,
        userId: like.userId,
        login: like.login,
      };
    });
    return mappedThreeLatestLikes;
  }
}
