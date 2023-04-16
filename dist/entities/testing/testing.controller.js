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
exports.TestingController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let TestingController = class TestingController {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async deleteAll(res) {
        await this.dataSource.query(`DELETE FROM "Attempts" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "BlogBansInfo" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "BlogOwnerInfo" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "CommentatorInfo" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "LikesInfo" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "PostInfoForComment" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "NewestLikes" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "ExtendedLikesInfo" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "Devices" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "PostsLikes" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "CommentsLikes" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "Tokens" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "BlogBans" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "UserBans" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "BanInfo" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "EmailConfirmation" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "PasswordRecovery" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "UserBanForBlog" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "Comments" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "Posts" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "Blogs" WHERE TRUE`);
        await this.dataSource.query(`DELETE FROM "Users" WHERE TRUE`);
        return res.sendStatus(204);
    }
};
__decorate([
    (0, common_1.Delete)('all-data'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestingController.prototype, "deleteAll", null);
TestingController = __decorate([
    (0, common_1.Controller)('testing'),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], TestingController);
exports.TestingController = TestingController;
//# sourceMappingURL=testing.controller.js.map