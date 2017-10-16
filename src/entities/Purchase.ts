import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn} from 'typeorm';
import {User} from './User';

@Entity()
export class Purchase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => User, user => user.purchases)
    user: User;

    @Column('jsonb')
    products: any;

    @Column('decimal', { precision: 12, scale: 2 })
    total: string;

    @CreateDateColumn()
    createdDate: Date;
}
