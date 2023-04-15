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
exports.PostsService = void 0;
const posts_repository_1 = require("./posts.repository");
const common_1 = require("@nestjs/common");
const comments_service_1 = require("../comments/comments.service");
const users_repository_1 = require("../users/users.repository");
const blogs_repository_1 = require("../blogs/blogs.repository");
const posts_likes_repository_1 = require("../likes/posts.likes.repository");
const bans_users_for_blog_repository_1 = require("../bans/bans.users-for-blog.repository");
let PostsService = class PostsService {
    constructor(postsRepository, blogsRepository, commentsService, usersRepository, postsLikesRepository, usersBansForBlogsRepo) {
        this.postsRepository = postsRepository;
        this.blogsRepository = blogsRepository;
        this.commentsService = commentsService;
        this.usersRepository = usersRepository;
        this.postsLikesRepository = postsLikesRepository;
        this.usersBansForBlogsRepo = usersBansForBlogsRepo;
    }
    async createPost(postBody, blogId, userId) {
        const blog = await this.blogsRepository.findBlogInstance(blogId);
        if (!blog)
            throw new common_1.NotFoundException();
        const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blogId);
        if (blogOwnerInfo.userId.toString() !== userId)
            throw new common_1.ForbiddenException();
        const createdAt = new Date().toISOString();
        const createdPost = await this.postsRepository.createPost(postBody.title, postBody.shortDescription, postBody.content, blogId, blog.name, createdAt);
        return {
            id: createdPost.id.toString(),
            title: createdPost.title,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdPost.blogId,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: [],
            },
        };
    }
    async deletePostById(postId, blogId, userId) {
        const blog = await this.blogsRepository.findBlogInstance(blogId);
        if (!blog)
            throw new common_1.NotFoundException();
        const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blogId);
        if (blogOwnerInfo.userId.toString() !== userId)
            throw new common_1.ForbiddenException();
        const post = await this.postsRepository.findPostInstance(postId);
        if (!post)
            throw new common_1.NotFoundException();
        await this.postsRepository.deletePost(postId);
    }
    async updatePostById(postBody, postId, blogId, userId) {
        const blog = await this.blogsRepository.findBlogInstance(blogId);
        if (!blog)
            throw new common_1.NotFoundException();
        const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blogId);
        if (blogOwnerInfo.userId.toString() !== userId)
            throw new common_1.ForbiddenException();
        const post = await this.postsRepository.findPostInstance(postId);
        if (!post)
            throw new common_1.NotFoundException();
        await this.postsRepository.updatePost(postId, postBody.title, postBody.shortDescription, postBody.content, blogId);
    }
    async createComment(postId, inputModel, userId) {
        const post = await this.postsRepository.findPostInstance(postId);
        if (!post)
            return null;
        const forbiddenPosts = await this.usersBansForBlogsRepo.getBannedPostsForUser(userId);
        if (forbiddenPosts.includes(post.id.toString()))
            throw new common_1.ForbiddenException();
        return await this.commentsService.createComment(postId, inputModel, userId);
    }
    async likePost(postId, likeStatus, userId) {
        const post = await this.postsRepository.findPostInstance(postId);
        if (!post)
            return false;
        const user = await this.usersRepository.findUserById(userId);
        const like = await this.postsLikesRepository.findLikeByPostIdAndUserId(postId, userId);
        if (!like) {
            const createdAt = new Date().toISOString();
            await this.postsLikesRepository.likePost(postId, likeStatus, userId, user.login, createdAt);
            return true;
        }
        await this.postsLikesRepository.updateLikeStatus(postId, userId, likeStatus);
        return true;
    }
};
PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [posts_repository_1.PostsRepository,
        blogs_repository_1.BlogsRepository,
        comments_service_1.CommentsService,
        users_repository_1.UsersRepository,
        posts_likes_repository_1.PostsLikesRepository,
        bans_users_for_blog_repository_1.UsersBansForBlogRepository])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map