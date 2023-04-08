import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsBlogAttached } from '../../shared/decorators/validation/blog-bound.decorator';
import { IsUserExists } from '../../shared/decorators/validation/user-exists.decorator';

export class blogParamModel {
  @IsString()
  @IsNotEmpty()
  // @IsBlogExists()
  blogId: string;
}

export class BanBlogModel {
  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean;
}

export class blogAndPostParamModel {
  @IsString()
  @IsNotEmpty()
  // @IsBlogExists()
  blogId: string;
  postId: string;
}

export class blogAndUserParamModel {
  @IsString()
  @IsNotEmpty()
  @IsBlogAttached()
  blogId: string;
  @IsUserExists()
  userId: string;
}

export class BlogViewModel {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public isMembership: boolean,
    public websiteUrl: string,
    public createdAt: string,
  ) {}
}

export class BlogSAViewModel {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public isMembership: boolean,
    public websiteUrl: string,
    public createdAt: string,
    public blogOwnerInfo: object,
    public banInfo: object,
  ) {}
}
