import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60, // 1 minute
        limit: 10, // 10 requests per minute
      },
      {
        name: 'long',
        ttl: 3600, // 1 hour
        limit: 100, // 100 requests per hour
      },
    ]),
    AuthModule,
    LoansModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}