import {Entity, Column, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Purchase} from './Purchase';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid', { unique: true, default: () => 'gen_random_uuid()' })
    token: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    fiscalNumber: string;

    @Column()
    creditCardType: string;

    @Column()
    creditCardNumber: string;

    @Column('date')
    creditCardExpiration: string;

    @Column()
    creditCardCvv: string;

    @Column()
    publicKey: string;

    @OneToMany(type => Purchase, purchase => purchase.user)
    purchases: Promise<Purchase[]>;
}
