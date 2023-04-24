import { DataSource } from 'typeorm';
import { createTokenModel, tokenSqlModel } from './tokens.models';
export declare class TokenRepository {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    findToken(exp: string): Promise<tokenSqlModel | null>;
    createToken(tokenDto: createTokenModel): Promise<void>;
    updateToken(previousExpirationDate: string, newExpiredAt: string, newIssuedAt: string): Promise<void>;
    deleteTokensForBan(userId: string): Promise<void>;
    deleteToken(exp: string): Promise<any>;
}
