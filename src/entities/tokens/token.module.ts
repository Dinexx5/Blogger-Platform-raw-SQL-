import { Module } from '@nestjs/common';

import { TokenRepository } from './token.repository';

@Module({
  imports: [],
  providers: [TokenRepository],
  exports: [TokenRepository],
})
export class TokensModule {}
