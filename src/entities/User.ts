import {Entity, Column, PrimaryColumn} from 'typeorm';

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

    @Column()
    creditCardExpiration: string;

    @Column()
    creditCardCvv: string;

    @Column()
    publicKey: string;
}
