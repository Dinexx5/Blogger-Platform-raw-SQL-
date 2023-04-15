import { Model } from 'mongoose';
import { DeviceDocument } from './devices.schema';
import { createDeviceModel } from './devices.models';
import { DataSource } from 'typeorm';
export declare class DevicesRepository {
    private deviceModel;
    protected dataSource: DataSource;
    constructor(deviceModel: Model<DeviceDocument>, dataSource: DataSource);
    createDevice(deviceDto: createDeviceModel): Promise<void>;
    findSessions(userId: string): Promise<any>;
    deleteDevicesForBan(userId: string): Promise<void>;
    deleteAllSessionsWithoutActive(deviceId: string, userId: string): Promise<void>;
    findSessionByDeviceId(deviceId: string): Promise<any>;
    updateLastActiveDate(deviceId: string, newIssuedAt: string): Promise<void>;
    deleteDevice(deviceId: string): Promise<void>;
    save(instance: any): Promise<void>;
}
