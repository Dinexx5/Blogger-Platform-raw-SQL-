import { ConfigModule } from '@nestjs/config';
const configModule = ConfigModule.forRoot({ isGlobal: true });
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './entities/users/users.module';
import { AuthModule } from './entities/auth/auth.module';
import { BlogsModule } from './entities/blogs/blogs.module';
import { PostsModule } from './entities/posts/posts.module';
import { CommentsModule } from './entities/comments/comments.module';
import { TestingModule } from './entities/testing/testing.module';
import { BansModule } from './entities/bans/bans.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.SQL_HOST_NAME,
      port: 5432,
      username: process.env.SQL_USERNAME,
      password: process.env.SQL_PASS,
      database: process.env.SQL_USERNAME,
      autoLoadEntities: false,
      synchronize: false,
    }),
    BansModule,
    UsersModule,
    AuthModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
