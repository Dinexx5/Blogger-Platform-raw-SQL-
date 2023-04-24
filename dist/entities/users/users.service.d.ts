import { UsersRepository } from './users.repository';
import { CreateUserModel, NewPasswordModel, SaUserViewModel, UserFromSqlRepo } from './userModels';
export declare class UsersService {
    protected usersRepository: UsersRepository;
    constructor(usersRepository: UsersRepository);
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
