'use strict';

module.exports = {
    name: 'User',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        username: {
            type: 'varchar'
        },
        password: {
            type: 'varchar'
        },
        name: {
            type: 'varchar'
        },
        address: {
            type: 'text'
        },
        fiscalNumber: {
            name: 'fiscal_number',
            type: 'varchar'
        },
        creditCardType: {
            name: 'credit_card_type',
            type: 'varchar'
        },
        creditCardNumber: {
            name: 'credit_card_number',
            type: 'varchar'
        },
        creditCardExpiration: {
            name: 'credit_card_expiration',
            type: 'date'
        },
        creditCardCvv: {
            name: 'credit_card_cvv',
            type: 'varchar'
        },
        publicKey: {
            name: 'public_key',
            type: 'varchar'
        }
    }
};
