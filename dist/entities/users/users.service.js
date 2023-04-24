"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async createUser(inputModel) {
        const passwordHash = await this.generateHash(inputModel.password);
        const expirationDate = (0, date_fns_1.addDays)(new Date(), 1);
        const confirmationCode = (0, uuid_1.v4)();
        const isConfirmed = true;
        const createdAt = new Date().toISOString();
        const createdUser = await this.usersRepository.createUser(inputModel.login, inputModel.email, passwordHash, createdAt, expirationDate, confirmationCode, isConfirmed);
        if (!createdUser) {
            return null;
        }
        return {
            id: createdUser.id.toString(),
            login: createdUser.login,
            email: createdUser.email,
            createdAt: createdUser.createdAt,
            banInfo: {
                isBanned: false,
                banDate: null,
                banReason: null,
            },
        };
    }
    async deleteUserById(userId) {
        const userInstance = await this.usersRepository.findUserById(userId);
        if (!userInstance)
            return false;
        await this.usersRepository.deleteUser(userId);
        return true;
    }
    async findUserByLoginOrEmail(login) {
        const user = await this.usersRepository.findUserByLoginOrEmail(login);
        if (!user)
            return null;
        return user;
    }
    async checkConfirmation(userId) {
        const isConfirmed = await this.usersRepository.findConfirmation(userId);
        return isConfirmed;
    }
    async generateHash(password) {
        const passwordSalt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, passwordSalt);
    }
    async updateCode(email, code) {
        const user = await this.usersRepository.findUserByLoginOrEmail(email);
        if (!user)
            return false;
        await this.usersRepository.updateConfirmationCode(user.id, code);
        return true;
    }
    async updateConfirmation(code) {
        const user = await this.usersRepository.findUserByConfirmationCode(code);
        if (!user)
            return false;
        await this.usersRepository.updateConfirmation(code);
        return true;
    }
    async updateRecoveryCode(email, recoveryCode) {
        const user = await this.usersRepository.findUserByLoginOrEmail(email);
        if (!user)
            return false;
        const expirationDate = (0, date_fns_1.add)(new Date(), { hours: 1 });
        await this.usersRepository.updateRecoveryCode(user.id, recoveryCode, expirationDate);
        return true;
    }
    async updatePassword(inputModel) {
        const user = await this.usersRepository.findUserByRecoveryCode(inputModel.recoveryCode);
        if (!user)
            return false;
        const newPasswordHash = await this.generateHash(inputModel.newPassword);
        await this.usersRepository.updatePassword(user.id, newPasswordHash);
        return true;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map