import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Posts } from "../../post/entities/post.entity";
import { Users } from "../../user/entities/user.entity";

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    post_id: number;

    @Column({ nullable: false })
    user_id: number;

    @Column({ type: 'text', nullable: false })
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ManyToOne(() => Posts, post => post.comments)
    @JoinColumn({ name: 'post_id' })
    post: Posts;

    @ManyToOne(() => Users, user => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: Users;
}