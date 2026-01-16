import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post as HttpPost,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
  ) {}

  // =========================
  // GET COMMENTS BY POST ID
  // =========================
  @Get()
  @ApiOperation({ summary: 'Get comments by post ID' })
  @ApiQuery({
    name: 'postId',
    type: Number,
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of comments for the post',
  })
  getByPost(@Query('postId') postId: number) {
    if (!postId) return [];

    return this.commentRepo.find({
      where: { postId },
      order: { date: 'ASC' },
    });
  }

  // =========================
  // CREATE COMMENT
  // =========================
  @HttpPost()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['postId', 'author', 'content'],
      properties: {
        postId: {
          type: 'number',
          example: 1,
        },
        author: {
          type: 'string',
          example: 'john_doe',
        },
        content: {
          type: 'string',
          example: 'This is a comment',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
  })
  create(
    @Body()
    body: {
      postId: number;
      author: string;
      content: string;
    },
  ) {
    const comment = this.commentRepo.create({
      postId: body.postId,
      author: body.author,
      content: body.content,
    });

    return this.commentRepo.save(comment);
  }

  // =========================
  // DELETE COMMENT (OWNER ONLY)
  // =========================
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment (author only)' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 5,
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['author'],
      properties: {
        author: {
          type: 'string',
          example: 'john_doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async remove(@Param('id') id: number, @Body() body: { author: string }) {
    const comment = await this.commentRepo.findOneBy({ id });

    if (!comment) {
      return { message: 'Comment not found' };
    }

    if (comment.author !== body.author) {
      return { message: 'Unauthorized' };
    }

    await this.commentRepo.remove(comment);
    return { message: 'Comment deleted' };
  }
}
