import { Model } from 'mongoose';
import { DevicesRepository } from './devices.repository';
import { DeviceDocument, deviceViewModel } from './devices.schema';
export declare class DevicesService {
    protected devicesRepository: DevicesRepository;
    private deviceModel;
    constructor(devicesRepository: DevicesRepository, deviceModel: Model<DeviceDocument>);
    createDevice(userId: string, ip: string, deviceName: string, deviceId: string, issuedAt: string): Promise<void>;
    findActiveDevices(userId: string): Promise<deviceViewModel[]>;
    deleteSessionById(userId: string, deviceId: string): Promise<void>;
}
