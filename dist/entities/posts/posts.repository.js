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
exports.PostsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PostsRepository = class PostsRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createPost(title, shortDescription, content, blogId, blogName, createdAt) {
        const postQuery = `INSERT INTO "Posts"
                   (title, "shortDescription", content, "blogId", "blogName", "createdAt")
                   VALUES ($1, $2, $3, $4, $5, $6)
                   RETURNING *;`;
        const extendedLikesInfoQuery = `INSERT INTO "ExtendedLikesInfo"
                   ("postId", "likesCount", "dislikesCount", "myStatus")
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;
        const result = await this.dataSource.query(postQuery, [
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt,
        ]);
        await this.dataSource.query(extendedLikesInfoQuery, [result[0].id, 0, 0, 'None']);
        return result[0];
    }
    async findPostInstance(postId) {
        const post = await this.dataSource.query(`
          SELECT *
          FROM "Posts"
          WHERE "id" = $1
      `, [postId]);
        return post[0];
    }
    async deletePost(postId) {
        await this.dataSource.query(`
          DELETE
          FROM "NewestLikes"
          WHERE "postId" = $1
      `, [postId]);
        await this.dataSource.query(`
          DELETE
          FROM "ExtendedLikesInfo"
          WHERE "postId" = $1
      `, [postId]);
        await this.dataSource.query(`
          DELETE
          FROM "Posts"
          WHERE "id" = $1
      `, [postId]);
    }
    async updatePost(postId, title, shortDescription, content, blogId) {
        await this.dataSource.query(`
          UPDATE "Posts"
          SET "title"= '${title}', "shortDescription"= '${shortDescription}',
           "content"= '${content}', "blogId"= '${blogId}'
          WHERE "id" = $1
      `, [postId]);
    }
    async findPostsForUser(bannedBlog) {
        if (bannedBlog.length === 0)
            return [];
        const posts = await this.dataSource.query(`
          SELECT *
          FROM "Posts"
          WHERE "blogId" IN ($1)
      `, [bannedBlog]);
        return posts.map((post) => post.id.toString());
    }
};
PostsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], PostsRepository);
exports.PostsRepository = PostsRepository;
//# sourceMappingURL=posts.repository.js.map