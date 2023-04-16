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
exports.BloggerBansQueryRepository = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bans_schema_1 = require("../bans/application/domain/bans.schema");
const common_1 = require("@nestjs/common");
const blogs_repository_1 = require("./blogs.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let BloggerBansQueryRepository = class BloggerBansQueryRepository {
    constructor(blogsRepository, banUserForBlogModel, dataSource) {
        this.blogsRepository = blogsRepository;
        this.banUserForBlogModel = banUserForBlogModel;
        this.dataSource = dataSource;
    }
    mapFoundBansToViewModel(ban) {
        return {
            id: ban.userId,
            login: ban.login,
            banInfo: {
                isBanned: ban.isBanned,
                banDate: ban.banDate,
                banReason: ban.banReason,
            },
        };
    }
    async getAllBannedUsersForBlog(query, blogId, userId) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10, searchLoginTerm = null, } = query;
        const skippedBlogsCount = (+pageNumber - 1) * +pageSize;
        const blog = await this.blogsRepository.findBlogInstance(blogId);
        if (!blog)
            throw new common_1.NotFoundException();
        const blogOwnerInfo = await this.blogsRepository.findBlogOwnerInfo(blogId);
        if (blogOwnerInfo.userId.toString() !== userId)
            throw new common_1.ForbiddenException();
        const subQuery = `(${searchLoginTerm ? `LOWER("login") LIKE '%' || LOWER('${searchLoginTerm}') || '%'` : true})`;
        const selectQuery = `SELECT "userId", "login", "isBanned","banDate","banReason"
                    FROM "UserBanForBlog"
                    WHERE ${subQuery}
                    ORDER BY 
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
        const counterQuery = `SELECT COUNT(*)
                    FROM "UserBanForBlog" u
                    WHERE ${subQuery}`;
        const counter = await this.dataSource.query(counterQuery);
        const count = counter[0].count;
        const bans = await this.dataSource.query(selectQuery, [
            sortDirection,
            pageSize,
            skippedBlogsCount,
        ]);
        const bansView = bans.map(this.mapFoundBansToViewModel);
        return {
            pagesCount: Math.ceil(+count / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +count,
            items: bansView,
        };
    }
};
BloggerBansQueryRepository = __decorate([
    __param(1, (0, mongoose_1.InjectModel)(bans_schema_1.UserForBlogBan.name)),
    __param(2, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        mongoose_2.Model,
        typeorm_2.DataSource])
], BloggerBansQueryRepository);
exports.BloggerBansQueryRepository = BloggerBansQueryRepository;
//# sourceMappingURL=blogger.bans.query-repository.js.map