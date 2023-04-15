import { UserDocument } from './users.schema';
import { paginatedViewModel, paginationQuerysSA } from '../../shared/models/pagination';
import { Model } from 'mongoose';
import { SaUserViewModel, SaUserFromSqlRepo } from './userModels';
import { DataSource } from 'typeorm';
export declare class SaUsersQueryRepository {
    private userModel;
    protected dataSource: DataSource;
    constructor(userModel: Model<UserDocument>, dataSource: DataSource);
    getAllUsers(query: paginationQuerysSA): Promise<paginatedViewModel<SaUserViewModel[]>>;
    mapDbUserToUserViewModel(user: SaUserFromSqlRepo): SaUserViewModel;
}
