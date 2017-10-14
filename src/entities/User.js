'use strict';

module.exports = {
    name: 'User',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            default: () => 'gen_random_uuid()'
        },
        name: {
            type: 'text'
        },
        address: {
            type: 'text'
        },
        fiscalNumber: {
            name: 'fiscal_number',
            type: 'text'
        },
        creditCardType: {
            name: 'credit_card_type',
            type: 'text'
        },
        creditCardNumber: {
            name: 'credit_card_number',
            type: 'text'
        },
        creditCardExpiration: {
            name: 'credit_card_expiration',
            type: 'date'
        },
        creditCardCvv: {
            name: 'credit_card_cvv',
            type: 'text'
        },
        publicKey: {
            name: 'public_key',
            type: 'text'
        }
    }
};
