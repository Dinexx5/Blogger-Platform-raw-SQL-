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
exports.BlogsQueryRepository = void 0;
const bans_repository_1 = require("../bans/bans.repository");
const bans_blogs_repository_1 = require("../bans/bans.blogs.repository");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let BlogsQueryRepository = class BlogsQueryRepository {
    constructor(bansRepository, blogBansRepository, dataSource) {
        this.bansRepository = bansRepository;
        this.blogBansRepository = blogBansRepository;
        this.dataSource = dataSource;
    }
    mapFoundBlogToBlogViewModel(blog) {
        return {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            isMembership: blog.isMembership,
            createdAt: blog.createdAt,
            id: blog.id.toString(),
        };
    }
    async getAllBlogs(query, userId) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10, searchNameTerm = null, } = query;
        const skippedBlogsCount = (+pageNumber - 1) * +pageSize;
        const bannedBlogsFromUsers = await this.bansRepository.getBannedBlogs();
        const bannedBlogs = await this.blogBansRepository.getBannedBlogs();
        const allBannedBlogs = bannedBlogs.concat(bannedBlogsFromUsers);
        const subQuery = `"id" ${allBannedBlogs.length ? `NOT IN (${allBannedBlogs})` : `IS NOT NULL`} AND (${searchNameTerm && !userId
            ? `LOWER("name") LIKE '%' || LOWER('${searchNameTerm}') || '%'`
            : userId && !searchNameTerm
                ? `"userId" = ${userId}`
                : userId && searchNameTerm
                    ? `LOWER("name") LIKE '%' || LOWER('${searchNameTerm}') || '%' AND
         "userId" = ${userId}`
                    : true})`;
        const selectQuery = `SELECT b.*, o."userId",
                                CASE
                                 WHEN "${sortBy}" = LOWER("${sortBy}") THEN 2
                                 ELSE 1
                                END toOrder
                    FROM "Blogs" b
                    LEFT JOIN "BlogOwnerInfo" o
                    ON b."id" = o."blogId"
                    WHERE ${subQuery}
                    ORDER BY toOrder,
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
        const counterQuery = `SELECT COUNT(*)
                    FROM "Blogs" b
                    LEFT JOIN "BlogOwnerInfo" o
                    ON b."id" = o."blogId"
                    WHERE ${subQuery}`;
        const counter = await this.dataSource.query(counterQuery);
        const count = counter[0].count;
        const blogs = await this.dataSource.query(selectQuery, [
            sortDirection,
            pageSize,
            skippedBlogsCount,
        ]);
        const blogsView = blogs.map(this.mapFoundBlogToBlogViewModel);
        return {
            pagesCount: Math.ceil(+count / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +count,
            items: blogsView,
        };
    }
    async findBlogById(blogId) {
        const bannedBlogsFromUsers = await this.bansRepository.getBannedBlogs();
        const bannedBlogs = await this.blogBansRepository.getBannedBlogs();
        const allBannedBlogs = bannedBlogs.concat(bannedBlogsFromUsers);
        const foundBlog = await this.dataSource.query(`
          SELECT *
          FROM "Blogs"
          WHERE "id" = $1
      `, [blogId]);
        if (!foundBlog.length)
            return null;
        if (allBannedBlogs.includes(foundBlog[0].id.toString()))
            return null;
        return this.mapFoundBlogToBlogViewModel(foundBlog[0]);
    }
};
BlogsQueryRepository = __decorate([
    __param(2, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [bans_repository_1.BansRepository,
        bans_blogs_repository_1.BlogBansRepository,
        typeorm_2.DataSource])
], BlogsQueryRepository);
exports.BlogsQueryRepository = BlogsQueryRepository;
//# sourceMappingURL=blogs.query-repo.js.map