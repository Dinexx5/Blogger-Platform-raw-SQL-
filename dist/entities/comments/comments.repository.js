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
exports.CommentsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CommentsRepository = class CommentsRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createComment(content, createdAt, userId, userLogin, postId, title, blogId, blogName) {
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
                   ("commentId", "postId", title, "blogId", "blogName")
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *;`;
        const result = await this.dataSource.query(commentQuery, [content, createdAt]);
        await this.dataSource.query(commentatorInfoQuery, [result[0].id, userId, userLogin]);
        await this.dataSource.query(likesInfoQuery, [result[0].id, 0, 0, 'None']);
        await this.dataSource.query(postInfoQuery, [result[0].id, postId, title, blogId, blogName]);
        return result[0];
    }
    async findComment(commentId) {
        const comment = await this.dataSource.query(`
          SELECT *
          FROM "Comments"
          WHERE "id" = $1
      `, [commentId]);
        return comment[0];
    }
    async findCommentatorInfo(commentId) {
        const comment = await this.dataSource.query(`
          SELECT *
          FROM "CommentatorInfo"
          WHERE "commentId" = $1
      `, [commentId]);
        return comment[0];
    }
    async updateComment(commentId, content) {
        await this.dataSource.query(`
          UPDATE "Comments"
          SET "content"= '${content}'
          WHERE "id" = $1
      `, [commentId]);
    }
    async deleteComment(commentId) {
        await this.dataSource.query(`
          DELETE
          FROM "CommentatorInfo"
          WHERE "commentId" = $1
      `, [commentId]);
        await this.dataSource.query(`
          DELETE
          FROM "LikesInfo"
          WHERE "commentId" = $1
      `, [commentId]);
        await this.dataSource.query(`
          DELETE
          FROM "PostInfoForComment"
          WHERE "commentId" = $1
      `, [commentId]);
        await this.dataSource.query(`
          DELETE
          FROM "Comments"
          WHERE "id" = $1
      `, [commentId]);
    }
    async findBannedComments(userId) {
        const commentsForUser = await this.dataSource.query(`
          SELECT "commentId"
          FROM "CommentatorInfo"
          WHERE "userId" = $1
      `, [userId]);
        const commentsIds = commentsForUser.map((comment) => comment.commentId.toString());
        return commentsIds;
    }
};
CommentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], CommentsRepository);
exports.CommentsRepository = CommentsRepository;
//# sourceMappingURL=comments.repository.js.map