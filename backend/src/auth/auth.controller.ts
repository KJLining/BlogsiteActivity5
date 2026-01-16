import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { User } from './user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  // =========================
  // REGISTER
  // =========================
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: {
          type: 'string',
          example: 'John Doe',
        },
        email: {
          type: 'string',
          example: 'john@example.com',
        },
        password: {
          type: 'string',
          example: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Missing fields or email already exists',
  })
  async register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
    },
  ) {
    const { name, email, password } = body;

    if (!name || !email || !password) {
      throw new BadRequestException('Missing fields');
    }

    const existing = await this.usersRepo.findOne({
      where: { email },
    });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const user = this.usersRepo.create({
      name,
      email,
      password,
    });

    await this.usersRepo.save(user);

    return { message: 'User registered' };
  }

  // =========================
  // LOGIN
  // =========================
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          example: 'john@example.com',
        },
        password: {
          type: 'string',
          example: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials',
  })
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.usersRepo.findOne({
      where: { email: body.email },
    });

    if (!user || user.password !== body.password) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
