import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post as HttpPost,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Post } from './entities/post.entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  // =========================
  // GET ALL POSTS
  // =========================
  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  async findAll() {
    const posts = await this.postRepo.find({
      order: { date: 'DESC' },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      author: post.author,
      date: post.date.toISOString(),
    }));
  }

  // =========================
  // GET SINGLE POST
  // =========================
  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postRepo.findOneBy({ id });
    if (!post) return null;

    return {
      ...post,
      date: post.date.toISOString(),
    };
  }

  // =========================
  // CREATE POST
  // =========================
  @HttpPost()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({
    schema: {
      required: ['title', 'excerpt', 'author'],
      properties: {
        title: { type: 'string' },
        excerpt: { type: 'string' },
        image: { type: 'string' },
        author: { type: 'string' },
      },
    },
  })
  async create(
    @Body()
    body: {
      title: string;
      excerpt: string;
      image?: string;
      author: string;
    },
  ) {
    const post = this.postRepo.create({
      title: body.title,
      excerpt: body.excerpt,
      image:
        body.image || `https://picsum.photos/600/300?random=${Math.random()}`,
      author: body.author,
    });

    const saved = await this.postRepo.save(post);

    return {
      ...saved,
      date: saved.date.toISOString(),
    };
  }

  // =========================
  // UPDATE POST (AUTHOR ONLY)
  // =========================
  @Put(':id')
  @ApiOperation({ summary: 'Update a post (author only)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      title: string;
      excerpt: string;
      image: string;
      author: string;
    },
  ) {
    const post = await this.postRepo.findOneBy({ id });

    if (!post) return { message: 'Post not found' };
    if (post.author !== body.author) return { message: 'Unauthorized' };

    post.title = body.title;
    post.excerpt = body.excerpt;
    post.image = body.image;

    const updated = await this.postRepo.save(post);

    return {
      ...updated,
      date: updated.date.toISOString(),
    };
  }

  // =========================
  // DELETE POST (AUTHOR ONLY)
  // =========================
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post (author only)' })
  @ApiBody({
    schema: {
      required: ['author'],
      properties: {
        author: { type: 'string', example: 'john_doe' },
      },
    },
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { author: string },
  ) {
    const post = await this.postRepo.findOneBy({ id });

    if (!post) return { message: 'Post not found' };
    if (post.author !== body.author) return { message: 'Unauthorized' };

    await this.postRepo.remove(post);
    return { message: 'Post deleted' };
  }
}
