import { Model } from 'mongoose';
import { TokenDocument } from './token.schema';
import { DataSource } from 'typeorm';
import { createTokenModel, tokenSqlModel } from './tokens.models';
export declare class TokenRepository {
    private tokenModel;
    protected dataSource: DataSource;
    constructor(tokenModel: Model<TokenDocument>, dataSource: DataSource);
    findToken(exp: string): Promise<tokenSqlModel | null>;
    createToken(tokenDto: createTokenModel): Promise<void>;
    updateToken(previousExpirationDate: string, newExpiredAt: string, newIssuedAt: string): Promise<void>;
    deleteTokensForBan(userId: string): Promise<void>;
    deleteToken(exp: string): Promise<any>;
    save(instance: any): Promise<void>;
}
