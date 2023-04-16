import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  Ban,
  BanDocument,
  BlogBan,
  BlogBanDocument,
  UserForBlogBan,
  UserForBlogBanDocument,
} from './application/domain/bans.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { createBanModel } from './bans.models';

@Injectable()
export class UsersBansForBlogRepository {
  constructor(
    @InjectModel(UserForBlogBan.name) private banUserForBlogModel: Model<UserForBlogBanDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async createBan(
    userId: string,
    login: string,
    blogId: string,
    isBanned: boolean,
    banReason: string,
    banDate: string,
    bannedPostsIds: string[],
  ) {
    const banQuery = `INSERT INTO "UserBanForBlog"
                   ("userId", login, "blogId", "isBanned", "banReason", "banDate", "bannedPostsIds")
                   VALUES ($1, $2, $3, $4, $5, $6, $7)
                   RETURNING *;`;
    await this.dataSource.query(banQuery, [
      userId,
      login,
      blogId,
      isBanned,
      banReason,
      banDate,
      bannedPostsIds,
    ]);
  }
  async findBanByBlogAndUserId(blogId: string, userId: string) {
    const ban = await this.dataSource.query(
      `
          SELECT *
          FROM "UserBanForBlog"
          WHERE "blogId" = $1 AND "userId" = $2
      `,
      [blogId, userId],
    );
    return ban[0];
  }
  async unbanUser(userId: string, blogId: string) {
    await this.dataSource.query(
      `
          DELETE
          FROM "UserBanForBlog"
          WHERE "blogId" = $1 AND "userId" = $2
      `,
      [blogId, userId],
    );
  }
  async countBannedUsers() {
    return this.banUserForBlogModel.countDocuments({});
  }
  async getBannedPostsForUser(userId: string) {
    const bannedUsersCount = await this.countBannedUsers();
    if (!bannedUsersCount) return [];
    const allBansForUser = await this.banUserForBlogModel.find({ userId: userId }).lean();
    const forbiddenPosts = [];
    allBansForUser.forEach((ban) => {
      forbiddenPosts.push(...ban.bannedPostsId);
    });
    return forbiddenPosts;
  }
  async save(instance: any) {
    instance.save();
  }
}
