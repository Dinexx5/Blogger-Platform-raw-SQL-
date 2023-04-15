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
exports.BlogsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let BlogsRepository = class BlogsRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createBlog(name, description, websiteUrl, isMembership, createdAt, userId, login) {
        const blogQuery = `INSERT INTO "Blogs"
                   (name, description, "isMembership", "websiteUrl", "createdAt")
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *;`;
        const banInfoQuery = `INSERT INTO "BlogBansInfo"
                   ("blogId", "isBanned", "banDate")
                   VALUES ($1, $2, $3)
                   RETURNING *;`;
        const blogOwnerQuery = `INSERT INTO "BlogOwnerInfo"
                   ("blogId", "userId", "userLogin")
                   VALUES ($1, $2, $3)
                   RETURNING *;`;
        const result = await this.dataSource.query(blogQuery, [
            name,
            description,
            isMembership,
            websiteUrl,
            createdAt,
        ]);
        await this.dataSource.query(banInfoQuery, [result[0].id, false, null]);
        await this.dataSource.query(blogOwnerQuery, [result[0].id, userId, login]);
        return result[0];
    }
    async findBlogInstance(blogId) {
        const blog = await this.dataSource.query(`
          SELECT *
          FROM "Blogs"
          WHERE "id" = $1
      `, [blogId]);
        return blog[0];
    }
    async findBlogOwnerInfo(blogId) {
        const blogOwnerInfo = await this.dataSource.query(`
          SELECT *
          FROM "BlogOwnerInfo"
          WHERE "blogId" = $1
      `, [blogId]);
        return blogOwnerInfo[0];
    }
    async updateBlog(blogId, name, description, websiteUrl) {
        await this.dataSource.query(`
          UPDATE "Blogs"
          SET "name"= '${name}', "description"= '${description}', "websiteUrl"= '${websiteUrl}'
          WHERE "id" = $1
      `, [blogId]);
    }
    async updateBanInfoForBan(blogId, banDate) {
        await this.dataSource.query(`
          UPDATE "BlogBansInfo"
          SET "isBanned"= true, "banDate"= '${banDate}'
          WHERE "blogId" = $1
      `, [blogId]);
    }
    async updateBanInfoForUnban(blogId) {
        await this.dataSource.query(`
          UPDATE "BlogBansInfo"
          SET "isBanned"= false, "banDate"= null
          WHERE "blogId" = $1
      `, [blogId]);
    }
    async bindBlogWithUser(blogId, userId, login) {
        await this.dataSource.query(`
          UPDATE "BlogOwnerInfo"
          SET "userId"= $2, "userLogin"= $3
          WHERE "blogId" = $1
      `, [blogId, userId, login]);
    }
    async deleteBlog(blogId) {
        await this.dataSource.query(`
          DELETE
          FROM "BlogOwnerInfo"
          WHERE "blogId" = $1
      `, [blogId]);
        await this.dataSource.query(`
          DELETE
          FROM "BlogBansInfo"
          WHERE "blogId" = $1
      `, [blogId]);
        await this.dataSource.query(`
          DELETE
          FROM "Blogs"
          WHERE "blogId" = $1
      `, [blogId]);
    }
    async findBlogsForUser(userId) {
        const blogsForUser = await this.dataSource.query(`
          SELECT "blogId"
          FROM "BlogOwnerInfo"
          WHERE "userId" = $1
      `, [userId]);
        const blogsIds = blogsForUser.map((blog) => blog.blogId.toString());
        return blogsIds;
    }
};
BlogsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], BlogsRepository);
exports.BlogsRepository = BlogsRepository;
//# sourceMappingURL=blogs.repository.js.map