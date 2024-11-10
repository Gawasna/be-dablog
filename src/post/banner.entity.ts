import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Banners {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    new: string;

    @CreateDateColumn()
    created_at: Date;
}