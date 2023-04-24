"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const posts_query_repo_1 = require("./posts.query-repo");
const posts_repository_1 = require("./posts.repository");
const posts_service_1 = require("./posts.service");
const posts_controller_1 = require("./posts.controller");
const users_module_1 = require("../users/users.module");
const blogs_query_repo_1 = require("../blogs/blogs.query-repo");
const comments_module_1 = require("../comments/comments.module");
const blogs_repository_1 = require("../blogs/blogs.repository");
const ban_user_use_case_1 = require("../bans/application/use-cases/ban.user.use.case.");
const bans_repository_1 = require("../bans/bans.repository");
const devices_module_1 = require("../devices/devices.module");
const token_module_1 = require("../tokens/token.module");
const posts_likes_repository_1 = require("../likes/posts.likes.repository");
const bans_blogs_repository_1 = require("../bans/bans.blogs.repository");
const cqrs_1 = require("@nestjs/cqrs");
const bans_users_for_blog_repository_1 = require("../bans/bans.users-for-blog.repository");
let PostsModule = class PostsModule {
};
PostsModule = __decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, auth_module_1.AuthModule, users_module_1.UsersModule, comments_module_1.CommentsModule, devices_module_1.DevicesModule, token_module_1.TokensModule],
        providers: [
            posts_service_1.PostsService,
            posts_repository_1.PostsRepository,
            posts_query_repo_1.PostsQueryRepository,
            blogs_query_repo_1.BlogsQueryRepository,
            blogs_repository_1.BlogsRepository,
            ban_user_use_case_1.BansUserUseCase,
            bans_repository_1.BansRepository,
            posts_likes_repository_1.PostsLikesRepository,
            bans_blogs_repository_1.BlogBansRepository,
            bans_users_for_blog_repository_1.UsersBansForBlogRepository,
        ],
        controllers: [posts_controller_1.PostsController],
        exports: [
            posts_service_1.PostsService,
            posts_repository_1.PostsRepository,
            posts_query_repo_1.PostsQueryRepository,
            blogs_query_repo_1.BlogsQueryRepository,
            blogs_repository_1.BlogsRepository,
            posts_likes_repository_1.PostsLikesRepository,
        ],
    })
], PostsModule);
exports.PostsModule = PostsModule;
//# sourceMappingURL=posts.module.js.map