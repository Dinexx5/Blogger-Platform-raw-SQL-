import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Comment, CommentDocument } from './comments.schema';
import { CommentsRepository } from './comments.repository';
import { UsersRepository } from '../users/users.repository';
import { CommentLike, CommentLikeDocument } from '../likes/comments.like.schema';
import { CommentsLikesRepository } from '../likes/comments.likes.repository';
import { CommentViewModel, CreateCommentModel } from './comments.models';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
    protected commentsLikesRepository: CommentsLikesRepository,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(CommentLike.name) private commentLikeModel: Model<CommentLikeDocument>,
  ) {}
  async createComment(
    postId: string,
    inputModel: CreateCommentModel,
    userId: string,
  ): Promise<CommentViewModel> {
    const user = await this.usersRepository.findUserById(userId);
    const post = await this.postsRepository.findPostInstance(postId);
    const createdAt = new Date().toISOString();
    const createdComment = await this.commentsRepository.createComment(
      inputModel.content,
      createdAt,
      user.id.toString(),
      user.login,
      post.id.toString(),
      post.title,
      post.blogId.toString(),
      post.blogName,
    );
    return {
      id: createdComment.id.toString(),
      content: createdComment.content,
      commentatorInfo: {
        userId: userId,
        userLogin: user.login,
      },
      createdAt: createdComment.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
  }
  async updateCommentById(commentId: string, inputModel: CreateCommentModel, userId: string) {
    const comment = await this.commentsRepository.findComment(commentId);
    if (!comment) throw new NotFoundException();
    const commentatorInfo = await this.commentsRepository.findCommentatorInfo(commentId);
    if (commentatorInfo.userId.toString() !== userId) throw new ForbiddenException();
    comment.content = inputModel.content;
    await this.commentsRepository.save(comment);
  }

  async deleteCommentById(commentId: string, userId: string) {
    const commentInstance = await this.commentsRepository.findComment(commentId);
    if (!commentInstance) throw new NotFoundException();
    if (commentInstance.commentatorInfo.userId !== userId) throw new ForbiddenException();
    await commentInstance.deleteOne();
  }

  async likeComment(commentId: string, likeStatus: string, userId: string): Promise<boolean> {
    const commentInstance = await this.commentsRepository.findComment(commentId);
    if (!commentInstance) {
      return false;
    }
    const likeInstance = await this.commentsLikesRepository.findLikeByCommentIdAndUserId(
      commentId,
      userId,
    );
    if (!likeInstance) {
      const likeDto = {
        commentId,
        likeStatus,
        userId,
        createdAt: new Date().toISOString(),
      };
      const newLikeInstance = new this.commentLikeModel(likeDto);
      await this.commentsLikesRepository.save(newLikeInstance);
      return true;
    }
    likeInstance.likeStatus = likeStatus;
    await this.commentsLikesRepository.save(likeInstance);
    return true;
  }
}
