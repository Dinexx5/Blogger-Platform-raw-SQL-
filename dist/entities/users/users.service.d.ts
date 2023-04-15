import { Model } from 'mongoose';
import { UserDocument } from './users.schema';
import { UsersRepository } from './users.repository';
import { CreateUserModel, NewPasswordModel, SaUserViewModel, UserFromSqlRepo } from './userModels';
export declare class UsersService {
    protected usersRepository: UsersRepository;
    private userModel;
    constructor(usersRepository: UsersRepository, userModel: Model<UserDocument>);
    createUser(inputModel: CreateUserModel): Promise<SaUserViewModel>;
    deleteUserById(userId: string): Promise<boolean>;
    findUserByLoginOrEmail(login: string): Promise<UserFromSqlRepo | null>;
    checkConfirmation(userId: string): Promise<UserFromSqlRepo | null>;
    generateHash(password: string): Promise<string>;
    updateCode(email: string, code: string): Promise<boolean>;
    updateConfirmation(code: string): Promise<boolean>;
    updateRecoveryCode(email: string, recoveryCode: string): Promise<boolean>;
    updatePassword(inputModel: NewPasswordModel): Promise<boolean>;
}
