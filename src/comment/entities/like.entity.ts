// like.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Posts } from "src/post/entities/post.entity";
import { Users } from "src/user/entities/user.entity";

@Entity('likes')
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    post_id: number;

    @Column()
    user_id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ManyToOne(() => Posts)
    @JoinColumn({ name: 'post_id' })
    post: Posts;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    user: Users;
}