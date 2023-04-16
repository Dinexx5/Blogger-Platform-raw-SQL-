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
exports.UsersBansForBlogRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bans_schema_1 = require("./application/domain/bans.schema");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let UsersBansForBlogRepository = class UsersBansForBlogRepository {
    constructor(banUserForBlogModel, dataSource) {
        this.banUserForBlogModel = banUserForBlogModel;
        this.dataSource = dataSource;
    }
    async createBan(userId, login, blogId, isBanned, banReason, banDate, bannedPostsIds) {
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
    async findBanByBlogAndUserId(blogId, userId) {
        const ban = await this.dataSource.query(`
          SELECT *
          FROM "UserBanForBlog"
          WHERE "blogId" = $1 AND "userId" = $2
      `, [blogId, userId]);
        return ban[0];
    }
    async unbanUser(userId, blogId) {
        await this.dataSource.query(`
          DELETE
          FROM "UserBanForBlog"
          WHERE "blogId" = $1 AND "userId" = $2
      `, [blogId, userId]);
    }
    async countBannedUsers() {
        return this.banUserForBlogModel.countDocuments({});
    }
    async getBannedPostsForUser(userId) {
        const bannedUsersCount = await this.countBannedUsers();
        if (!bannedUsersCount)
            return [];
        const allBansForUser = await this.banUserForBlogModel.find({ userId: userId }).lean();
        const forbiddenPosts = [];
        allBansForUser.forEach((ban) => {
            forbiddenPosts.push(...ban.bannedPostsId);
        });
        return forbiddenPosts;
    }
    async save(instance) {
        instance.save();
    }
};
UsersBansForBlogRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bans_schema_1.UserForBlogBan.name)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        typeorm_2.DataSource])
], UsersBansForBlogRepository);
exports.UsersBansForBlogRepository = UsersBansForBlogRepository;
//# sourceMappingURL=bans.users-for-blog.repository.js.map