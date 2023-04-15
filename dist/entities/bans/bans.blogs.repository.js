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
exports.BlogBansRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let BlogBansRepository = class BlogBansRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createBan(blogId, isBanned, bannedPostsIds) {
        const banQuery = `INSERT INTO "BlogBans"
                   ("blogId", "isBanned", "bannedPostsIds")
                   VALUES ($1, $2, $3)
                   RETURNING *;`;
        await this.dataSource.query(banQuery, [blogId, isBanned, bannedPostsIds]);
    }
    async unbanBlog(blogId) {
        await this.dataSource.query(`
          DELETE
          FROM "BlogBans"
          WHERE "blogId" = $1
      `, [blogId]);
    }
    async findBanByBlogId(blogId) {
        const ban = await this.dataSource.query(`
          SELECT *
          FROM "BlogBans"
          WHERE "blogId" = $1
      `, [blogId]);
        return ban[0];
    }
    async countBannedBlogs() {
        const counterQuery = `SELECT COUNT(*)
                    FROM "BlogBans" `;
        const counter = await this.dataSource.query(counterQuery);
        return counter[0].count;
    }
    async getBannedBlogs() {
        const bannedUsersCount = await this.countBannedBlogs();
        if (!bannedUsersCount)
            return [];
        const allBans = await this.dataSource.query(`SELECT * FROM "BlogBans"`);
        const bannedBlogs = [];
        allBans.forEach((ban) => {
            bannedBlogs.push(ban.blogId);
        });
        return bannedBlogs;
    }
    async getBannedPosts() {
        const bannedUsersCount = await this.countBannedBlogs();
        if (!bannedUsersCount)
            return [];
        const allBans = await this.dataSource.query(`SELECT * FROM "BlogBans"`);
        const bannedPosts = [];
        allBans.forEach((ban) => {
            bannedPosts.push(...ban.bannedPostsIds);
        });
        return bannedPosts;
    }
};
BlogBansRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], BlogBansRepository);
exports.BlogBansRepository = BlogBansRepository;
//# sourceMappingURL=bans.blogs.repository.js.map