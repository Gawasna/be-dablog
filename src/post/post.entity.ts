import { Entity, Column, PrimaryGeneratedColumn, Timestamp, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity'
import { Category } from '../category/category.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content_path: string;

  @Column({ nullable: true })
  image_path: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Timestamp;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Timestamp;

  @Column()
  author_id: number;

  @Column({ nullable: true })
  category_id: number;

  @Column({ type: 'enum', enum: ['public', 'hidden'], default: 'public' })
  status: string;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => Category, category => category.posts)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}