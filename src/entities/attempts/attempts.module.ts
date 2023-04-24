import { Module } from '@nestjs/common';
import { AttemptsRepository } from './attempts.repository';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';

@Module({
  imports: [],
  providers: [AttemptsRepository, RateLimitGuard],
  exports: [AttemptsRepository, RateLimitGuard],
})
export class AttemptsModule {}
