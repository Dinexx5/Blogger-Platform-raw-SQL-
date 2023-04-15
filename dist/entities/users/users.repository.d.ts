import { DataSource } from 'typeorm';
export declare class UsersRepository {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    createUser(login: string, email: string, passwordHash: string, createdAt: string, expirationDate: Date, confirmationCode: string, isConfirmed: boolean): Promise<any>;
    findUserById(userId: string): Promise<any>;
    deleteUser(userId: string): Promise<boolean>;
    updateBanInfoForBan(userId: string, banDate: string, banReason: string): Promise<void>;
    updateBanInfoForUnban(userId: string): Promise<void>;
    findConfirmation(userId: string): Promise<any>;
    findUserByConfirmationCode(code: string): Promise<any>;
    updateConfirmation(code: string): Promise<void>;
    updateConfirmationCode(userId: string, code: string): Promise<void>;
    findUserByLoginOrEmail(loginOrEmail: string): Promise<any>;
    findUserByRecoveryCode(code: string): Promise<any>;
    updateRecoveryCode(userId: string, recoveryCode: string, expirationDate: Date): Promise<void>;
    updatePassword(userId: string, passwordHash: string): Promise<void>;
    save(instance: any): Promise<void>;
}
