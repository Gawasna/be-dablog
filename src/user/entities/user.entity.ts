import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Posts } from '../../post/entities/post.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  status: number;
  
  @Column({ nullable: true })
  avatar: string;

  @Column()
  refresh_token: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @CreateDateColumn()
  token_create_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @OneToMany(() => Posts, post => post.author)
  posts: Posts[];
}