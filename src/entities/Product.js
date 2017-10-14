'use strict';

module.exports = {
    name: 'Product',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        barcode: {
            type: 'text'
        },
        name: {
            type: 'text'
        },
        price: {
            type: 'money'
        },
        maker: {
            type: 'text'
        },
        model: {
            type: 'text'
        }
    }
};
