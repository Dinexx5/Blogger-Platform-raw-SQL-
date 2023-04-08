import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Ban, BanDocument } from './application/domain/bans.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { createBanModel } from './bans.models';

@Injectable()
export class BansRepository {
  constructor(
    @InjectModel(Ban.name) private banModel: Model<BanDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async findBanByUserId(userId: string) {
    const ban = await this.dataSource.query(
      `
          SELECT *
          FROM "UserBans"
          WHERE "userId" = $1
      `,
      [userId],
    );
    return ban[0];
  }
  async createBan(banDto: createBanModel) {
    const banQuery = `INSERT INTO "UserBans"
                   ("userId", login, "isBanned", "banReason")
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;
    const ban = await this.dataSource.query(banQuery, [
      banDto.userId,
      banDto.login,
      banDto.isBanned,
      banDto.banReason,
    ]);
    return ban[0];
  }
  async deleteBan(userId: string) {
    await this.dataSource.query(
      `
          DELETE
          FROM "UserBans"
          WHERE "userId" = $1
      `,
      [userId],
    );
  }
  async countBannedUsers() {
    return this.banModel.countDocuments({});
  }
  async getBannedUsers() {
    const allBans = await this.banModel.find({}).lean();
    const bannedUsers = [];
    allBans.forEach((ban) => {
      bannedUsers.push(ban.userId);
    });
    return bannedUsers;
  }
  async getBannedBlogs() {
    const bannedUsersCount = await this.countBannedUsers();
    if (!bannedUsersCount) return [];
    const allBans = await this.banModel.find({}).lean();
    const bannedBlogs = [];
    allBans.forEach((ban) => {
      bannedBlogs.push(...ban.bannedBlogsId);
    });
    const bannedBlogsObjId = bannedBlogs.map((blogId) => new mongoose.Types.ObjectId(blogId));
    return bannedBlogsObjId;
  }
  async getBannedPosts() {
    const bannedUsersCount = await this.countBannedUsers();
    if (!bannedUsersCount) return [];
    const allBans = await this.banModel.find({}).lean();
    const bannedPosts = [];
    allBans.forEach((ban) => {
      bannedPosts.push(...ban.bannedPostsId);
    });
    const bannedPostsObjId = bannedPosts.map((postId) => new mongoose.Types.ObjectId(postId));
    return bannedPostsObjId;
  }
  async getBannedComments() {
    const bannedUsersCount = await this.countBannedUsers();
    if (!bannedUsersCount) return [];
    const allBans = await this.banModel.find({}).lean();
    const bannedComments = [];
    allBans.forEach((ban) => {
      bannedComments.push(...ban.bannedCommentsId);
    });
    const bannedCommentsObjId = bannedComments.map(
      (commentId) => new mongoose.Types.ObjectId(commentId),
    );
    return bannedCommentsObjId;
  }
  async save(instance: any) {
    instance.save();
  }
}
