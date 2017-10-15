import 'reflect-metadata';
import {createConnection, Connection} from 'typeorm';
import {Product} from './src/entities/Product';

(async () => {
    const connection: Connection = await createConnection();
    await connection.createQueryBuilder().delete().from(Product).execute();
    await connection.createQueryBuilder()
        .insert().into(Product)
        .values([
            { barcode: '61234567890', name: 'Apple iPhone 7', price: '899.99', maker: 'Apple', model: 'A1660' },
            { barcode: '12853478357', name: 'Samsung Galaxy S8', price: '759.95', maker: 'Samsung', model: 'G950F' },
            { barcode: '83248709823', name: 'Oneplus 5', price: '499.98', maker: 'Oneplus', model: 'A5000'}
        ])
        .execute()
        .catch((error) => {
            console.error(error);
            return connection.close();
        });
    await connection.close();
})();