import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comments.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async createComment(
    content: string,
    createdAt: string,
    userId: string,
    userLogin: string,
    postId: string,
    title: string,
    blogId: string,
    blogName: string,
  ) {
    const commentQuery = `INSERT INTO "Comments"
                   (content, "createdAt")
                   VALUES ($1, $2)
                   RETURNING *;`;
    const commentatorInfoQuery = `INSERT INTO "CommentatorInfo"
                   ("commentId", "userId", "userLogin")
                   VALUES ($1, $2, $3)
                   RETURNING *;`;
    const likesInfoQuery = `INSERT INTO "LikesInfo"
                   ("commentId", "likesCount", "dislikesCount", "myStatus")
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;
    const postInfoQuery = `INSERT INTO "PostInfoForComment"
                   ("commentId", id, title, "blogId", "blogName")
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *;`;

    const result = await this.dataSource.query(commentQuery, [content, createdAt]);
    await this.dataSource.query(commentatorInfoQuery, [result[0].id, userId, userLogin]);
    await this.dataSource.query(likesInfoQuery, [result[0].id, 0, 0, 'None']);
    await this.dataSource.query(postInfoQuery, [result[0].id, postId, title, blogId, blogName]);
    return result[0];
  }
  async findComment(commentId: string) {
    const comment = await this.dataSource.query(
      `
          SELECT *
          FROM "Comments"
          WHERE "id" = $1
      `,
      [commentId],
    );
    return comment[0];
  }
  async findCommentatorInfo(commentId: string) {
    const comment = await this.dataSource.query(
      `
          SELECT *
          FROM "CommentatorInfo"
          WHERE "commentId" = $1
      `,
      [commentId],
    );
    return comment[0];
  }
  async findBannedComments(userId: string) {
    const commentInstances = await this.commentModel
      .find({ 'commentatorInfo.userId': userId })
      .lean();
    const comments = commentInstances.map((comment) => comment._id.toString());
    return comments;
  }

  async save(instance: any) {
    instance.save();
  }
}
