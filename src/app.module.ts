import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, BookmarksModule, PrismaModule],
})
export class AppModule {}
