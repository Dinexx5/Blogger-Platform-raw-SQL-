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
                   ("userId", login, "isBanned", "banReason",
                    "bannedBlogsIds", "bannedPostsIds", "bannedCommentsIds")
                   VALUES ($1, $2, $3, $4, $5, $6, $7)
                   RETURNING *;`;
    const ban = await this.dataSource.query(banQuery, [
      banDto.userId,
      banDto.login,
      banDto.isBanned,
      banDto.banReason,
      banDto.bannedBlogsIds,
      banDto.bannedPostsIds,
      banDto.bannedCommentsIds,
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
    const counterQuery = `SELECT COUNT(*)
                    FROM "UserBans" `;
    const counter = await this.dataSource.query(counterQuery);
    return counter[0].count;
  }
  async getBannedUsers() {
    const allBans = await this.dataSource.query(`SELECT * FROM "UserBans"`);
    const bannedUsers = [];
    allBans.forEach((ban) => {
      bannedUsers.push(ban.userId);
    });
    return bannedUsers;
  }
  async getBannedBlogs() {
    const bannedUsersCount = await this.countBannedUsers();
    if (!bannedUsersCount) return [];
    const allBans = await this.dataSource.query(`SELECT * FROM "UserBans"`);
    const bannedBlogs = [];
    allBans.forEach((ban) => {
      bannedBlogs.push(...ban.bannedBlogsId);
    });
    return bannedBlogs;
  }
  async getBannedPosts() {
    const bannedUsersCount = await this.countBannedUsers();
    if (!bannedUsersCount) return [];
    const allBans = await this.dataSource.query(`SELECT * FROM "UserBans"`);
    const bannedPosts = [];
    allBans.forEach((ban) => {
      bannedPosts.push(...ban.bannedPostsId);
    });
    return bannedPosts;
  }
  async getBannedComments() {
    const bannedUsersCount = await this.countBannedUsers();
    if (!bannedUsersCount) return [];
    const allBans = await this.dataSource.query(`SELECT * FROM "UserBans"`);
    const bannedComments = [];
    allBans.forEach((ban) => {
      bannedComments.push(...ban.bannedCommentsId);
    });
    return bannedComments;
  }
}
