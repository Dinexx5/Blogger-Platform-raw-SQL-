import { UsersRepository } from '../../../users/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BanModel } from '../../../users/userModels';
import { BansRepository } from '../../bans.repository';
import { Ban, BanDocument } from '../domain/bans.schema';
import { DevicesRepository } from '../../../devices/devices.repository';
import { TokenRepository } from '../../../tokens/token.repository';
import { BlogsRepository } from '../../../blogs/blogs.repository';
import { PostsRepository } from '../../../posts/posts.repository';
import { CommentsRepository } from '../../../comments/comments.repository';
import { User, UserDocument } from '../../../users/users.schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class BansUserCommand {
  constructor(public userId: string, public inputModel: BanModel) {}
}

@CommandHandler(BansUserCommand)
export class BansUserUseCase implements ICommandHandler<BansUserCommand> {
  constructor(
    protected usersRepository: UsersRepository,
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected commentsRepository: CommentsRepository,
    protected bansRepository: BansRepository,
    protected devicesRepository: DevicesRepository,
    protected tokensRepository: TokenRepository,
    @InjectModel(Ban.name) private banModel: Model<BanDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async execute(command: BansUserCommand): Promise<boolean> {
    const userId = command.userId;
    const inputModel = command.inputModel;
    const user = await this.usersRepository.findUserById(userId);
    const login = user.login;
    if (inputModel.isBanned === true) {
      const isBannedBefore = await this.bansRepository.findBanByUserId(userId);
      if (isBannedBefore) return;
      const banDate = new Date().toISOString();
      await this.usersRepository.updateBanInfoForBan(userId, banDate, inputModel.banReason);
      await this.devicesRepository.deleteDevicesForBan(userId);
      await this.tokensRepository.deleteTokensForBan(userId);
      const bannedBlogsIds = await this.blogsRepository.findBlogsForUser(userId);
      const bannedPostsIds = await this.postsRepository.findPostsForUser(bannedBlogsIds);
      const bannedCommentsIds = await this.commentsRepository.findBannedComments(userId);
      const banDto = {
        userId,
        login,
        ...inputModel,
        bannedBlogsIds,
        bannedPostsIds,
        bannedCommentsIds,
      };
      await this.bansRepository.createBan(banDto);
      return;
    }
    const bananaInstance = await this.bansRepository.findBanByUserId(userId);
    if (!bananaInstance) {
      return;
    }
    await this.usersRepository.updateBanInfoForUnban(userId);
    await this.bansRepository.deleteBan(userId);
  }
}
