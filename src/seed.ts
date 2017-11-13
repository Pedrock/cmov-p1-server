import 'reflect-metadata';
import {createConnection, Connection} from 'typeorm';
import {Product} from './server/entities/Product';

(async () => {
    const connection: Connection = await createConnection();
    await connection.createQueryBuilder().delete().from(Product).execute();
    await connection.createQueryBuilder()
        .insert().into(Product)
        .values([
            { barcode: '61234567890', name: 'Apple iPhone 7', price: '899.99', maker: 'Apple', model: 'A1660',
              description: `iPhone 7 and iPhone 7 Plus are smartphones designed, developed, and marketed by Apple Inc. They were announced on September 7, 2016, at the Bill Graham Civic Auditorium in San Francisco by Apple CEO Tim Cook, and were released on September 16, 2016, succeeding the iPhone 6S and iPhone 6S Plus as the flagship devices in the iPhone series. Apple also released the iPhone 7 and 7 Plus in numerous countries worldwide throughout September and October 2016. They were succeeded as flagship devices by the iPhone 8 and iPhone 8 Plus on September 22, 2017, and the iPhone X on November 3, 2017.
The iPhone 7's overall design is similar to the iPhone 6S, but introduces new color options, water and dust resistance, a new capacitive, static home button, and removes the 3.5 mm headphone jack. The device's internal hardware also received upgrades, including a heterogeneous quad-core system-on-chip with improved system and graphics performance, and upgraded 12 megapixel rear-facing cameras with optical image stabilization on all models and an additional telephoto lens on the iPhone 7 Plus model to provide enhanced zoom capabilities.` },
            { barcode: '12853478357', name: 'Samsung Galaxy S8', price: '759.95', maker: 'Samsung', model: 'G950F',
              description: `The Samsung Galaxy S8, Samsung Galaxy S8+ and Samsung Galaxy S8 Active (shortened to S8 and S8+, respectively) are Android smartphones produced by Samsung Electronics as part of the Samsung Galaxy S series. Unveiled on 29 March 2017, they succeed the Samsung Galaxy S7 and S7 Edge, with a North American release on 21 April 2017 and UK availability on 28 April 2017.
The S8 and S8+ contain upgraded hardware and major design changes over their predecessors, the Galaxy S7 and S7 Edge, including larger screens with a taller aspect ratio and curved sides on both the smaller and larger models, iris and face recognition, a new suite of virtual assistant features known as Bixby (along with a new dedicated physical button for launching the assistant), and a docking station accessory that allows the phones to be used with a personal computer-styled desktop interface with keyboard and mouse input support.` },
            { barcode: '83248709823', name: 'Oneplus 5', price: '499.98', maker: 'Oneplus', model: 'A5000',
              description: `The OnePlus 5 (also abbreviated as OP5) is a smartphone made by OnePlus. It is the successor to the OnePlus 3T released in 2016. The OnePlus 5 was officially unveiled during a keynote on 20 June 2017.` }
        ])
        .execute()
        .catch((error) => {
            console.error(error);
            return connection.close();
        });
    await connection.close();
})();