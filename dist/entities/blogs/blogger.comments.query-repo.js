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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comments_likes_repository_1 = require("../likes/comments.likes.repository");
let BloggerCommentsQueryRepository = class BloggerCommentsQueryRepository {
    constructor(blogsRepository, postsRepository, commentsLikesRepository, dataSource) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.commentsLikesRepository = commentsLikesRepository;
        this.dataSource = dataSource;
    }
    mapCommentsToViewModel(comment) {
        return {
            id: comment.id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.userId.toString(),
                userLogin: comment.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesCount || 0,
                dislikesCount: comment.dislikesCount || 0,
                myStatus: comment.myStatus || 'None',
            },
            postInfo: {
                id: comment.postId.toString(),
                title: comment.title,
                blogId: comment.blogId,
                blogName: comment.blogName,
            },
        };
    }
    async getAllComments(query, userId) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = query;
        const skippedBlogsCount = (+pageNumber - 1) * +pageSize;
        const allBlogs = await this.blogsRepository.findBlogsForUser(userId);
        const allPosts = await this.postsRepository.findPostsToGetComments(allBlogs);
        const subQuery = `${allPosts.length ? `"postId" IN (${allPosts})` : `false`}`;
        const selectQuery = `SELECT c.*, ci.*, pi.*,
                                CASE
                                 WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
                                 ELSE 1
                                END toOrder
                    FROM "Comments" c
                    LEFT JOIN "CommentatorInfo" ci
                    ON c."id" = ci."commentId"
                    
                    LEFT JOIN "PostInfoForComment" pi
                    ON c."id" = pi."commentId"
                    WHERE ${subQuery}
                    ORDER BY toOrder,
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
        console.log(selectQuery);
        const comments = await this.dataSource.query(selectQuery, [
            sortDirection,
            pageSize,
            skippedBlogsCount,
        ]);
        const count = comments.length;
        await this.countLikesForComments(comments, userId);
        const commentsView = comments.map(this.mapCommentsToViewModel);
        return {
            pagesCount: Math.ceil(+count / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +count,
            items: commentsView,
        };
    }
    async countLikesForComments(comments, userId) {
        for (const comment of comments) {
            const foundLikes = await this.commentsLikesRepository.findLikesForComment(comment.id.toString());
            if (!foundLikes)
                return;
            const likeOfUser = foundLikes.find((like) => like.userId.toString() === userId);
            if (likeOfUser) {
                comment.myStatus = likeOfUser.likeStatus;
            }
            const likesCount = foundLikes.filter((like) => like.likeStatus === 'Like').length;
            const dislikesCount = foundLikes.filter((like) => like.likeStatus === 'Dislike').length;
            comment.likesCount = likesCount;
            comment.dislikesCount = dislikesCount;
        }
    }
};
BloggerCommentsQueryRepository = __decorate([
    __param(3, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        posts_repository_1.PostsRepository,
        comments_likes_repository_1.CommentsLikesRepository,
        typeorm_2.DataSource])
], BloggerCommentsQueryRepository);
exports.BloggerCommentsQueryRepository = BloggerCommentsQueryRepository;
//# sourceMappingURL=blogger.comments.query-repo.js.map