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
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const devices_repository_1 = require("./devices.repository");
const devices_schema_1 = require("./devices.schema");
const mongoose_2 = require("@nestjs/mongoose");
let DevicesService = class DevicesService {
    constructor(devicesRepository, deviceModel) {
        this.devicesRepository = devicesRepository;
        this.deviceModel = deviceModel;
    }
    async createDevice(userId, ip, deviceName, deviceId, issuedAt) {
        const deviceDTO = {
            userId: userId,
            ip: ip,
            title: deviceName,
            deviceId: deviceId,
            lastActiveDate: issuedAt,
        };
        await this.devicesRepository.createDevice(deviceDTO);
    }
    async findActiveDevices(userId) {
        const foundDevices = await this.devicesRepository.findSessions(userId);
        return foundDevices.map((device) => ({
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device.deviceId,
        }));
    }
    async deleteSessionById(userId, deviceId) {
        const foundDevice = await this.devicesRepository.findSessionByDeviceId(deviceId);
        if (!foundDevice)
            throw new common_1.NotFoundException();
        if (foundDevice.userId.toString() !== userId)
            throw new common_1.ForbiddenException();
        await this.devicesRepository.deleteDevice(deviceId);
    }
};
DevicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)(devices_schema_1.Device.name)),
    __metadata("design:paramtypes", [devices_repository_1.DevicesRepository,
        mongoose_1.Model])
], DevicesService);
exports.DevicesService = DevicesService;
//# sourceMappingURL=devices.service.js.map