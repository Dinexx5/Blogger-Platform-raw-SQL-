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
exports.DevicesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const devices_schema_1 = require("./devices.schema");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DevicesRepository = class DevicesRepository {
    constructor(deviceModel, dataSource) {
        this.deviceModel = deviceModel;
        this.dataSource = dataSource;
    }
    async createDevice(deviceDto) {
        const deviceQuery = `INSERT INTO "Devices"
                   ("userId", ip, title, "lastActiveDate", "deviceId")
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *;`;
        await this.dataSource.query(deviceQuery, [
            deviceDto.userId,
            deviceDto.ip,
            deviceDto.title,
            deviceDto.lastActiveDate,
            deviceDto.deviceId,
        ]);
    }
    async findSessions(userId) {
        const devices = await this.dataSource.query(`
          SELECT *
          FROM "Devices"
          WHERE "userId" = $1
      `, [userId]);
        return devices;
    }
    async deleteDevicesForBan(userId) {
        await this.dataSource.query(`
          DELETE
          FROM "Devices"
          WHERE "userId" = $1
      `, [userId]);
    }
    async deleteAllSessionsWithoutActive(deviceId, userId) {
        await this.dataSource.query(`
          DELETE
          FROM "Devices"
          WHERE "deviceId" = $1 AND "userId" = $2
      `, [deviceId, userId]);
    }
    async findSessionByDeviceId(deviceId) {
        const device = await this.dataSource.query(`
          SELECT *
          FROM "Devices"
          WHERE "deviceId" = $1
      `, [deviceId]);
        return device[0];
    }
    async updateLastActiveDate(deviceId, newIssuedAt) {
        await this.dataSource.query(`
          UPDATE "Devices"
          SET "lastActiveDate" = '${newIssuedAt}'
          WHERE "deviceId" = $1
      `, [deviceId]);
    }
    async deleteDevice(deviceId) {
        await this.dataSource.query(`
          DELETE
          FROM "Devices"
          WHERE "deviceId" = $1
      `, [deviceId]);
    }
    async save(instance) {
        instance.save();
    }
};
DevicesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(devices_schema_1.Device.name)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [mongoose_1.Model,
        typeorm_2.DataSource])
], DevicesRepository);
exports.DevicesRepository = DevicesRepository;
//# sourceMappingURL=devices.repository.js.map