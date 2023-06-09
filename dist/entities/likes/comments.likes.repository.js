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
exports.CommentsLikesRepository = void 0;
const common_1 = require("@nestjs/common");
const bans_repository_1 = require("../bans/bans.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CommentsLikesRepository = class CommentsLikesRepository {
    constructor(bansRepository, dataSource) {
        this.bansRepository = bansRepository;
        this.dataSource = dataSource;
    }
    async likeComment(commentId, likeStatus, userId, createdAt) {
        const likeQuery = `INSERT INTO "CommentsLikes"
                   ("commentId", "likeStatus", "userId", "createdAt")
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;
        await this.dataSource.query(likeQuery, [commentId, likeStatus, userId, createdAt]);
    }
    async findLikeByCommentIdAndUserId(commentId, userId) {
        const like = await this.dataSource.query(`
          SELECT *
          FROM "CommentsLikes"
          WHERE "commentId" = $1 AND "userId" = $2
      `, [commentId, userId]);
        return like[0];
    }
    async updateLikeStatus(commentId, userId, likeStatus) {
        await this.dataSource.query(`
          UPDATE "CommentsLikes"
          SET "likeStatus"= $3
          WHERE "commentId" = $1 AND "userId" = $2
      `, [commentId, userId, likeStatus]);
    }
    async findLikesForComment(commentId) {
        const bannedUsers = await this.bansRepository.getBannedUsers();
        const likes = await this.dataSource.query(`
          SELECT *
          FROM "CommentsLikes"
          WHERE "commentId" = $1 AND "userId" ${bannedUsers.length ? `NOT IN (${bannedUsers})` : `IS NOT NULL`}
      `, [commentId]);
        return likes;
    }
};
CommentsLikesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [bans_repository_1.BansRepository,
        typeorm_2.DataSource])
], CommentsLikesRepository);
exports.CommentsLikesRepository = CommentsLikesRepository;
//# sourceMappingURL=comments.likes.repository.js.map