import * as BaseJoi from 'joi';
import * as JoiDateExtensions from 'joi-date-extensions';
import JoiNifExtension from '../lib/joi-nif-extension';
const Joi = BaseJoi.extend(<any>[JoiDateExtensions, JoiNifExtension]);
const Relish = require('relish')({
    messages: {
        'fiscal_number': 'Please enter a valid fiscal number',
        'credit_card_number': 'Please enter a valid credit card number',
        'credit_card_cvv': 'Please enter a valid credit card CVV'
    }
});

export const login = {
    payload: {
        username: Joi.string().required(),
        password: Joi.string().required()
    }
};

export const register = {
    failAction: Relish.failAction,
    payload: {
        username: Joi.string().required(),
        password: Joi.string().required(),
        name: Joi.string().required(),
        address: Joi.string().required(),
        fiscal_number: Joi.string().nif().required().example('123456789'),
        credit_card_number: Joi.string().creditCard().required().example('347126431469340'),
        credit_card_type: Joi.string().valid('visa', 'mastercard', 'american express').required(),
        credit_card_expiration: Joi.date().format('YYYY-MM').required().example('2020-01'),
        credit_card_cvv: Joi.string().regex(/^[0-9]{3}$/, 'CVV').required().example('123'),
        public_key: Joi.string().required()
    }
};

export const getProduct = {
    query: Joi.object().keys({
        id: Joi.number().integer(),
        barcode: Joi.string().regex(/^[0-9]{11}$/, 'barcode').example('61234567890')
    }).xor('id', 'barcode')
};

export const getProducts = {
    query: {
        barcodes: Joi.string().regex(/^[0-9]{11}(,[0-9]{11})*$/).required().example('61234567890,12853478357,83248709823'),
    }
};

export const postPurchase = {
    payload: {
        list: Joi.string().required().example('[]'),
        signature: (<any>Joi.string()).base64().required()
    }
};

export const getPurchase = {
    params: Joi.object().keys({
        token: Joi.string().uuid('uuidv4').required()
    })
};