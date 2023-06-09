import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TokenRepository } from '../tokens/token.repository';
import { DevicesService } from '../devices/devices.service';
import { EmailAdapter } from '../../adapters/email.adapter';
import { DevicesRepository } from '../devices/devices.repository';
import { CreateUserModel, NewPasswordModel } from '../users/userModels';
import { BansRepository } from '../bans/bans.repository';
import { UsersRepository } from '../users/users.repository';
export declare class AuthService {
    private readonly emailAdapter;
    private readonly usersService;
    private readonly usersRepository;
    private readonly jwtService;
    protected tokenRepository: TokenRepository;
    protected devicesService: DevicesService;
    protected devicesRepository: DevicesRepository;
    protected bansRepository: BansRepository;
    constructor(emailAdapter: EmailAdapter, usersService: UsersService, usersRepository: UsersRepository, jwtService: JwtService, tokenRepository: TokenRepository, devicesService: DevicesService, devicesRepository: DevicesRepository, bansRepository: BansRepository);
    validateUser(username: string, password: string): Promise<any>;
    createJwtAccessToken(userId: string): Promise<string>;
    createJwtRefreshToken(userId: string, deviceName: string, ip: string): Promise<string>;
    updateJwtRefreshToken(deviceId: string, exp: number, userId: string): Promise<string>;
    getRefreshTokenInfo(token: string): Promise<any>;
    getAccessTokenInfo(token: string): Promise<any>;
    deleteCurrentToken(token: string): Promise<void>;
    deleteDeviceForLogout(token: string): Promise<void>;
    createUser(inputModel: CreateUserModel): Promise<any>;
    resendEmail(email: string): Promise<boolean>;
    confirmEmail(code: string): Promise<boolean>;
    sendEmailForPasswordRecovery(email: string): Promise<boolean>;
    updatePassword(inputModel: NewPasswordModel): Promise<boolean>;
}
