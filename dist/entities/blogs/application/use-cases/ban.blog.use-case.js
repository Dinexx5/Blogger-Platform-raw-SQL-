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
exports.BansBlogUseCase = exports.BanBlogCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const posts_repository_1 = require("../../../posts/posts.repository");
const bans_blogs_repository_1 = require("../../../bans/bans.blogs.repository");
const blogs_repository_1 = require("../../blogs.repository");
const common_1 = require("@nestjs/common");
class BanBlogCommand {
    constructor(blogId, inputModel) {
        this.blogId = blogId;
        this.inputModel = inputModel;
    }
}
exports.BanBlogCommand = BanBlogCommand;
let BansBlogUseCase = class BansBlogUseCase {
    constructor(blogsRepository, postsRepository, blogBansRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.blogBansRepository = blogBansRepository;
    }
    async execute(command) {
        const blogId = command.blogId;
        const inputModel = command.inputModel;
        const isBanned = inputModel.isBanned;
        const blog = await this.blogsRepository.findBlogInstance(blogId);
        if (!blog)
            throw new common_1.NotFoundException();
        if (isBanned === true) {
            const isBannedBefore = await this.blogBansRepository.findBanByBlogId(blogId);
            if (isBannedBefore)
                return;
            const banDate = new Date().toISOString();
            await this.blogsRepository.updateBanInfoForBan(blogId, banDate);
            const bannedPostsIds = await this.postsRepository.findPostsForUser([blogId]);
            await this.blogBansRepository.createBan(blogId, isBanned, bannedPostsIds);
            return;
        }
        const banana = await this.blogBansRepository.findBanByBlogId(blogId);
        if (!banana) {
            return;
        }
        await this.blogsRepository.updateBanInfoForUnban(blogId);
        await this.blogBansRepository.unbanBlog(blogId);
    }
};
BansBlogUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(BanBlogCommand),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        posts_repository_1.PostsRepository,
        bans_blogs_repository_1.BlogBansRepository])
], BansBlogUseCase);
exports.BansBlogUseCase = BansBlogUseCase;
//# sourceMappingURL=ban.blog.use-case.js.map