"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BansRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bans_schema_1 = require("./application/domain/bans.schema");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let BansRepository = class BansRepository {
    constructor(banModel, dataSource) {
        this.banModel = banModel;
        this.dataSource = dataSource;
    }
    async findBanByUserId(userId) {
        const ban = await this.dataSource.query(`
          SELECT *
          FROM "UserBans"
          WHERE "userId" = $1
      `, [userId]);
        return ban[0];
    }
    async createBan(banDto) {
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
    async deleteBan(userId) {
        await this.dataSource.query(`
          DELETE
          FROM "UserBans"
          WHERE "userId" = $1
      `, [userId]);
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
        if (!bannedUsersCount)
            return [];
        const allBans = await this.dataSource.query(`SELECT * FROM "UserBans"`);
        const bannedBlogs = [];
        allBans.forEach((ban) => {
            bannedBlogs.push(...ban.bannedBlogsIds);
        });
        return bannedBlogs;
    }
    async getBannedPosts() {
        const bannedUsersCount = await this.countBannedUsers();
        if (!bannedUsersCount)
            return [];
        const allBans = await this.dataSource.query(`SELECT * FROM "UserBans"`);
        const bannedPosts = [];
        allBans.forEach((ban) => {
            bannedPosts.push(...ban.bannedPostsIds);
        });
        return bannedPosts;
    }
    async getBannedComments() {
        const bannedUsersCount = await this.countBannedUsers();
        if (!bannedUsersCount)
            return [];
        const allBans = await this.dataSource.query(`SELECT * FROM "UserBans"`);
        const bannedComments = [];
        allBans.forEach((ban) => {
            bannedComments.push(...ban.bannedCommentsIds);
        });
        return bannedComments;
    }
};
BansRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bans_schema_1.Ban.name)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        typeorm_2.DataSource])
], BansRepository);
exports.BansRepository = BansRepository;
//# sourceMappingURL=bans.repository.js.map