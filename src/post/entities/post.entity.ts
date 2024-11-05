import { Entity, Column, PrimaryGeneratedColumn, Timestamp, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Users } from '../../user/entities/user.entity'
import { Category } from '../../category/entities/category.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('posts')
export class Posts {
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

  @ManyToOne(() => Users, user => user.posts)
  @JoinColumn({ name: 'author_id' })
  author: Users;

  @ManyToOne(() => Category, category => category.posts)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];
}