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
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let UsersRepository = class UsersRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createUser(login, email, passwordHash, createdAt, expirationDate, confirmationCode, isConfirmed) {
        const userQuery = `INSERT INTO "Users"
                   (login, email, "passwordHash", "createdAt")
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;
        const banQuery = `INSERT INTO "BanInfo"
                   ("userId", "isBanned", "banDate", "banReason")
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;
        const emailConfirmationQuery = `INSERT INTO "EmailConfirmation"
                   ("userId", "confirmationCode", "expirationDate", "isConfirmed")
                   VALUES ($1, $2, $3, $4)
                   RETURNING *;`;
        const passwordRecoveryQuery = `INSERT INTO "PasswordRecovery"
                   ("userId", "recoveryCode", "expirationDate")
                   VALUES ($1, $2, $3)
                   RETURNING *;`;
        const result = await this.dataSource.query(userQuery, [login, email, passwordHash, createdAt]);
        await this.dataSource.query(banQuery, [result[0].id, false, null, null]);
        await this.dataSource.query(emailConfirmationQuery, [
            result[0].id,
            confirmationCode,
            expirationDate,
            isConfirmed,
        ]);
        await this.dataSource.query(passwordRecoveryQuery, [result[0].id, null, null]);
        return result[0];
    }
    async findUserById(userId) {
        const users = await this.dataSource.query(`
          SELECT *
          FROM "Users"
          WHERE "id" = $1
      `, [userId]);
        return users[0];
    }
    async deleteUser(userId) {
        await this.dataSource.query(`
          DELETE
          FROM "BanInfo"
          WHERE "userId" = $1
      `, [userId]);
        await this.dataSource.query(`
          DELETE
          FROM "EmailConfirmation"
          WHERE "userId" = $1
      `, [userId]);
        await this.dataSource.query(`
          DELETE
          FROM "PasswordRecovery"
          WHERE "userId" = $1
      `, [userId]);
        await this.dataSource.query(`
          DELETE
          FROM "Users"
          WHERE "id" = $1
      `, [userId]);
        return true;
    }
    async updateBanInfoForBan(userId, banDate, banReason) {
        const query = `
        UPDATE "BanInfo"
        SET "isBanned"= true, "banDate"= '${banDate}', "banReason"= '${banReason}'
        WHERE "userId" = $1
    `;
        await this.dataSource.query(query, [userId]);
    }
    async updateBanInfoForUnban(userId) {
        await this.dataSource.query(`
          UPDATE "BanInfo"
          SET "isBanned"= false, "banDate"= null, "banReason"= null
          WHERE "userId" = $1
      `, [userId]);
    }
    async findConfirmation(userId) {
        const isConfirmed = await this.dataSource.query(`
          SELECT *
          FROM "EmailConfirmation"
          WHERE "userId" = $1
      `, [userId]);
        return isConfirmed[0].isConfirmed;
    }
    async findConfirmationInfo(userId) {
        const isConfirmed = await this.dataSource.query(`
          SELECT *
          FROM "EmailConfirmation"
          WHERE "userId" = $1
      `, [userId]);
        return isConfirmed[0];
    }
    async findPasswordRecoveryInfo(userId) {
        const isConfirmed = await this.dataSource.query(`
          SELECT *
          FROM "PasswordRecovery"
          WHERE "userId" = $1
      `, [userId]);
        return isConfirmed[0];
    }
    async findUserByConfirmationCode(code) {
        const user = await this.dataSource.query(`
          SELECT *
          FROM "EmailConfirmation"
          WHERE "confirmationCode" = $1
      `, [code]);
        return user[0];
    }
    async updateConfirmation(code) {
        await this.dataSource.query(`
          UPDATE "EmailConfirmation"
          SET "isConfirmed" = true
          WHERE "confirmationCode" = $1
      `, [code]);
    }
    async updateConfirmationCode(userId, code) {
        await this.dataSource.query(`
          UPDATE "EmailConfirmation"
          SET "confirmationCode" = '${code}'
          WHERE "userId" = $1
      `, [userId]);
    }
    async findUserByLoginOrEmail(loginOrEmail) {
        const users = await this.dataSource.query(`
          SELECT *
          FROM "Users"
          WHERE "login" = $1 OR "email" = $1
      `, [loginOrEmail]);
        return users[0];
    }
    async findUserByRecoveryCode(code) {
        const user = await this.dataSource.query(`
          SELECT *
          FROM "PasswordRecovery"
          WHERE "recoveryCode" = $1
      `, [code]);
        return user[0];
    }
    async updateRecoveryCode(userId, recoveryCode, expirationDate) {
        await this.dataSource.query(`
          UPDATE "PasswordRecovery"
          SET "recoveryCode" = '${recoveryCode}', "expirationDate" = '${expirationDate}'
          WHERE "userId" = $1
      `, [userId]);
    }
    async updatePassword(userId, passwordHash) {
        await this.dataSource.query(`
          UPDATE "Users"
          SET "passwordHash" = '${passwordHash}'
          WHERE "userId" = $1
      `, [userId]);
    }
};
UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], UsersRepository);
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=users.repository.js.map