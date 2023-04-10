import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CommentLike, CommentLikeDocument } from './comments.like.schema';
import { BansRepository } from '../bans/bans.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsLikesRepository {
  constructor(
    protected bansRepository: BansRepository,
    @InjectModel(CommentLike.name) private commentLikeModel: Model<CommentLikeDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async likeComment(commentId: string, likeStatus: string, userId: string, createdAt: string) {
    const likeQuery = `INSERT INTO "CommentsLikes"
                   ("postId", "likeStatus", "userId", "createdAt")
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;
    await this.dataSource.query(likeQuery, [commentId, likeStatus, userId, createdAt]);
  }
  async findLikeByCommentIdAndUserId(commentId: string, userId: string) {
    const like = await this.dataSource.query(
      `
          SELECT *
          FROM "CommentsLikes"
          WHERE "commentId" = $1 AND "userId" = $2
      `,
      [commentId, userId],
    );
    return like[0];
  }
  async updateLikeStatus(commentId: string, userId: string, likeStatus: string) {
    await this.dataSource.query(
      `
          UPDATE "CommentsLikes"
          SET "likeStatus"= $3
          WHERE "postId" = $1 AND "userId" = $2
      `,
      [commentId, userId, likeStatus],
    );
  }
  async findLikesForComment(commentId: string) {
    const bannedUsers = await this.bansRepository.getBannedUsers();
    return this.commentLikeModel.find({ commentId: commentId, userId: { $nin: bannedUsers } });
  }
  async save(instance: any) {
    instance.save();
  }
}
