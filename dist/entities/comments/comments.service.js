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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const comments_repository_1 = require("./comments.repository");
const users_repository_1 = require("../users/users.repository");
const comments_likes_repository_1 = require("../likes/comments.likes.repository");
const posts_repository_1 = require("../posts/posts.repository");
let CommentsService = class CommentsService {
    constructor(commentsRepository, postsRepository, usersRepository, commentsLikesRepository) {
        this.commentsRepository = commentsRepository;
        this.postsRepository = postsRepository;
        this.usersRepository = usersRepository;
        this.commentsLikesRepository = commentsLikesRepository;
    }
    async createComment(postId, inputModel, userId) {
        const user = await this.usersRepository.findUserById(userId);
        const post = await this.postsRepository.findPostInstance(postId);
        const createdAt = new Date().toISOString();
        const createdComment = await this.commentsRepository.createComment(inputModel.content, createdAt, user.id.toString(), user.login, post.id.toString(), post.title, post.blogId.toString(), post.blogName);
        return {
            id: createdComment.id.toString(),
            content: createdComment.content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.login,
            },
            createdAt: createdComment.createdAt,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
            },
        };
    }
    async updateCommentById(commentId, inputModel, userId) {
        const comment = await this.commentsRepository.findComment(commentId);
        if (!comment)
            throw new common_1.NotFoundException();
        const commentatorInfo = await this.commentsRepository.findCommentatorInfo(commentId);
        if (commentatorInfo.userId.toString() !== userId)
            throw new common_1.ForbiddenException();
        await this.commentsRepository.updateComment(commentId, inputModel.content);
    }
    async deleteCommentById(commentId, userId) {
        const commentInstance = await this.commentsRepository.findComment(commentId);
        if (!commentInstance)
            throw new common_1.NotFoundException();
        const commentatorInfo = await this.commentsRepository.findCommentatorInfo(commentId);
        if (commentatorInfo.userId.toString() !== userId)
            throw new common_1.ForbiddenException();
        await this.commentsRepository.deleteComment(commentId);
    }
    async likeComment(commentId, likeStatus, userId) {
        const comment = await this.commentsRepository.findComment(commentId);
        if (!comment)
            return false;
        const like = await this.commentsLikesRepository.findLikeByCommentIdAndUserId(commentId, userId);
        if (!like) {
            const createdAt = new Date().toISOString();
            await this.commentsLikesRepository.likeComment(commentId, likeStatus, userId, createdAt);
            return true;
        }
        await this.commentsLikesRepository.updateLikeStatus(commentId, userId, likeStatus);
        return true;
    }
};
CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [comments_repository_1.CommentsRepository,
        posts_repository_1.PostsRepository,
        users_repository_1.UsersRepository,
        comments_likes_repository_1.CommentsLikesRepository])
], CommentsService);
exports.CommentsService = CommentsService;
//# sourceMappingURL=comments.service.js.map