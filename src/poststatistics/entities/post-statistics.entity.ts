import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Posts } from 'src/post/entities/post.entity';

@Entity('post_statistics')
export class PostStatistics {
  @PrimaryColumn()
  post_id: number;

  @OneToOne(() => Posts, (post) => post.statistics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  @Column({ default: 0 })
  total_likes: number;

  @Column({ default: 0 })
  total_comments: number;

  @UpdateDateColumn()
  updated_at: Date;
}
