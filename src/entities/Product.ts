import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    barcode: string;

    @Column()
    name: string;

    @Column('decimal', { precision: 12, scale: 2 })
    price: string;

    @Column()
    maker: string;

    @Column()
    model: string;

}
