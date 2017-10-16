import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn} from 'typeorm';
import {User} from './User';

@Entity()
export class Purchase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid', { unique: true, default: () => 'uuid_generate_v4()' })
    token: string;

    @ManyToOne(type => User, user => user.purchases)
    user: User;

    @Column('jsonb')
    products: any;

    @Column('decimal', { precision: 12, scale: 2 })
    total: string;

    @CreateDateColumn()
    date: Date;
}
