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
exports.BlogsSAQueryRepository = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const blogs_schema_1 = require("./domain/blogs.schema");
const mongoose_2 = require("mongoose");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let BlogsSAQueryRepository = class BlogsSAQueryRepository {
    constructor(blogModel, dataSource) {
        this.blogModel = blogModel;
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
            blogOwnerInfo: {
                userId: blog.userId,
                userLogin: blog.userLogin,
            },
            banInfo: {
                isBanned: blog.isBanned,
                banDate: blog.banDate,
            },
        };
    }
    async getAllBlogs(query) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10, searchNameTerm = null, } = query;
        const skippedBlogsCount = (+pageNumber - 1) * +pageSize;
        const subQuery = `(${searchNameTerm ? `LOWER("name") LIKE '%' || LOWER('${searchNameTerm}') || '%'` : true})`;
        const selectQuery = `SELECT blog.*, ban."isBanned",ban."banDate", o."userId", o."userLogin"
                    FROM "Blogs" blog
                    LEFT JOIN "BlogOwnerInfo" o
                    ON blog."id" = o."blogId"
                    LEFT JOIN "BlogBansInfo" ban
                    ON blog."id" = ban."blogId"
                    WHERE ${subQuery}
                    ORDER BY 
                      CASE when $1 = 'desc' then "${sortBy}" END DESC,
                      CASE when $1 = 'asc' then "${sortBy}" END ASC
                    LIMIT $2
                    OFFSET $3
                    `;
        const counterQuery = `SELECT COUNT(*)
                    FROM "Blogs" blog
                    LEFT JOIN "BlogOwnerInfo" o
                    ON blog."id" = o."blogId"
                    LEFT JOIN "BlogBansInfo" ban
                    ON blog."id" = o."blogId"
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
};
BlogsSAQueryRepository = __decorate([
    __param(0, (0, mongoose_1.InjectModel)(blogs_schema_1.Blog.name)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        typeorm_2.DataSource])
], BlogsSAQueryRepository);
exports.BlogsSAQueryRepository = BlogsSAQueryRepository;
//# sourceMappingURL=sa.blog.query-repo.js.map