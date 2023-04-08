import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from './devices.schema';
import { createBanModel } from '../bans/bans.models';
import { createDeviceModel } from './devices.models';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async createDevice(deviceDto: createDeviceModel) {
    const deviceQuery = `INSERT INTO "Devices"
                   ("userId", ip, title, "lastActiveDate", "deviceId")
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *;`;
    const device = await this.dataSource.query(deviceQuery, [
      deviceDto.userId,
      deviceDto.ip,
      deviceDto.title,
      deviceDto.lastActiveDate,
      deviceDto.deviceId,
    ]);
  }
  async findDeviceById(deviceId: string) {
    return this.deviceModel.findOne({ deviceId: deviceId });
  }
  async findSessions(userId: string) {
    const _id = new mongoose.Types.ObjectId(userId);
    return this.deviceModel.find({ userId: _id });
  }
  async deleteDevicesForBan(userId: string) {
    await this.dataSource.query(
      `
          DELETE
          FROM "Devices"
          WHERE "userId" = $1
      `,
      [userId],
    );
  }
  async deleteAllSessionsWithoutActive(deviceId: string, userId: mongoose.Types.ObjectId) {
    await this.deviceModel.deleteMany({
      $and: [{ userId: userId }, { deviceId: { $ne: deviceId } }],
    });
  }
  async findSessionByDeviceId(deviceId: string) {
    const device = await this.dataSource.query(
      `
          SELECT *
          FROM "Devices"
          WHERE "deviceId" = $1
      `,
      [deviceId],
    );
    return device[0];
  }
  async updateLastActiveDate(deviceId: string, newIssuedAt: string) {
    await this.dataSource.query(
      `
          UPDATE "Devices"
          SET "lastActiveDate" = '${newIssuedAt}'
          WHERE "deviceId" = $1
      `,
      [deviceId],
    );
  }
  async deleteDevice(deviceId: string) {
    await this.dataSource.query(
      `
          DELETE
          FROM "Devices"
          WHERE "deviceId" = $1
      `,
      [deviceId],
    );
  }
  async save(instance: any) {
    instance.save();
  }
}
