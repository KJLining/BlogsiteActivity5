import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  excerpt: string;

  @Column()
  image: string;

  @Column()
  author: string;

  @CreateDateColumn()
  date: Date;
}
