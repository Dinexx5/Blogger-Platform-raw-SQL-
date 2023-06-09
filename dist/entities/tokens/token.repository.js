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
exports.TokenRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let TokenRepository = class TokenRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findToken(exp) {
        const token = await this.dataSource.query(`
          SELECT *
          FROM "Tokens"
          WHERE "expiredAt" = $1
      `, [exp]);
        return token[0];
    }
    async createToken(tokenDto) {
        const tokenQuery = `INSERT INTO "Tokens"
                   ("issuedAt", "expiredAt", "deviceId", "deviceName", ip, "userId")
                   VALUES ($1, $2, $3, $4, $5, $6)
                   RETURNING *;`;
        await this.dataSource.query(tokenQuery, [
            tokenDto.issuedAt,
            tokenDto.expiredAt,
            tokenDto.deviceId,
            tokenDto.deviceName,
            tokenDto.ip,
            tokenDto.userId,
        ]);
    }
    async updateToken(previousExpirationDate, newExpiredAt, newIssuedAt) {
        const query = `
        UPDATE "Tokens"
        SET "issuedAt"= '${newIssuedAt}', "expiredAt"= '${newExpiredAt}'
        WHERE "expiredAt" = $1
    `;
        await this.dataSource.query(query, [previousExpirationDate]);
    }
    async deleteTokensForBan(userId) {
        await this.dataSource.query(`
          DELETE
          FROM "Tokens"
          WHERE "userId" = $1
      `, [userId]);
    }
    async deleteToken(exp) {
        const token = await this.dataSource.query(`
          DELETE
          FROM "Tokens"
          WHERE "expiredAt" = $1
      `, [exp]);
        return token[0];
    }
};
TokenRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], TokenRepository);
exports.TokenRepository = TokenRepository;
//# sourceMappingURL=token.repository.js.map