import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    barcode: string;

    @Column()
    name: string;

    @Column({ type: 'money' })
    price: number;

    @Column()
    maker: string;

    @Column()
    model: string;

}
