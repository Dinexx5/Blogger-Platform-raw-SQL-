import { DevicesRepository } from './devices.repository';
import { deviceViewModel } from './devices.models';
export declare class DevicesService {
    protected devicesRepository: DevicesRepository;
    constructor(devicesRepository: DevicesRepository);
    createDevice(userId: string, ip: string, deviceName: string, deviceId: string, issuedAt: string): Promise<void>;
    findActiveDevices(userId: string): Promise<deviceViewModel[]>;
    deleteSessionById(userId: string, deviceId: string): Promise<void>;
}
