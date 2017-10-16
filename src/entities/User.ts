import {Entity, Column, PrimaryColumn, OneToMany} from 'typeorm';
import {Purchase} from './Purchase';

@Entity()
export class User {
    @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
    id: string;

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
