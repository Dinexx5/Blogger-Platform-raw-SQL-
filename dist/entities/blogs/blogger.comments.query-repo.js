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
exports.BloggerCommentsQueryRepository = void 0;
const blogs_repository_1 = require("./blogs.repository");
const posts_repository_1 = require("../posts/posts.repository");
const mongoose_1 = require("@nestjs/mongoose");
const comments_schema_1 = require("../comments/comments.schema");
const mongoose_2 = require("mongoose");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let BloggerCommentsQueryRepository = class BloggerCommentsQueryRepository {
    constructor(blogsRepository, postsRepository, commentModel, dataSource) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.commentModel = commentModel;
        this.dataSource = dataSource;
    }
    mapCommentsToViewModel(comment) {
        return {
            id: comment.id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus,
            },
            postInfo: {
                id: comment.postInfo.id,
                title: comment.postInfo.title,
                blogId: comment.postInfo.blogId,
                blogName: comment.postInfo.blogName,
            },
        };
    }
    async getAllComments(query, userId) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;
        const skippedBlogsCount = (+pageNumber - 1) * +pageSize;
        const allBlogs = await this.blogsRepository.findBlogsForUser(userId);
        const allPosts = await this.postsRepository.findPostsForUser(allBlogs);
        const selectQuery = `SELECT c.*, ci.*, li*, pi*
                    FROM "Comments" c
                    LEFT JOIN "CommentatorInfo" ci
                    ON c."id" = ci."commentId"
                    LEFT JOIN "LikesInfo" li
                    ON c."id" = li."commentId"
                    LEFT JOIN "PostInfoForComment" pi
                    ON c."id" = pi."commentId"
                    WHERE "postId" ${allPosts.length ? `IN (${allPosts})` : `IS NOT NULL`}
                    ORDER BY 
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
        const counterQuery = `SELECT COUNT(*)
                    FROM "Comments" c
                    LEFT JOIN "CommentatorInfo" ci
                    ON c."id" = ci."commentId"
                    LEFT JOIN "LikesInfo" li
                    ON c."id" = li."commentId"
                    LEFT JOIN "PostInfoForComment" pi
                    ON c."id" = pi."commentId"
                    WHERE "postId" ${allPosts.length ? `IN (${allPosts})` : `IS NOT NULL`}`;
        const counter = await this.dataSource.query(counterQuery);
        const count = counter[0].count;
        const comments = await this.dataSource.query(selectQuery, [
            sortDirection,
            pageSize,
            skippedBlogsCount,
        ]);
        const commentsView = comments.map(this.mapCommentsToViewModel);
        return {
            pagesCount: Math.ceil(+count / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +count,
            items: commentsView,
        };
    }
};
BloggerCommentsQueryRepository = __decorate([
    __param(2, (0, mongoose_1.InjectModel)(comments_schema_1.Comment.name)),
    __param(3, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        posts_repository_1.PostsRepository,
        mongoose_2.Model,
        typeorm_2.DataSource])
], BloggerCommentsQueryRepository);
exports.BloggerCommentsQueryRepository = BloggerCommentsQueryRepository;
//# sourceMappingURL=blogger.comments.query-repo.js.map