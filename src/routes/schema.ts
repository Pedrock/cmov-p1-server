import * as BaseJoi from 'joi';
const Joi = BaseJoi.extend(require('joi-date-extensions'));

export const register = {
    payload: {
        name: Joi.string().required(),
        address: Joi.string().required(),
        fiscal_number: Joi.string().regex(/^[0-9]{9}$/, 'fiscal number').required(), // TODO - better validation
        credit_card_number: Joi.string().creditCard().required(),
        credit_card_type: Joi.string().valid('visa', 'mastercard', 'american express').required(),
        credit_card_expiration: Joi.date().format('YYYY-MM'),
        credit_card_cvv: Joi.string().regex(/^[0-9]{3}$/, 'CVV').required(),
        public_key: Joi.string().required()
    }
};

export const getProduct = {
    query: Joi.object().keys({
        id: Joi.number().integer(),
        barcode: Joi.string().regex(/^[0-9]{11}$/, 'barcode')
    }).xor('id', 'barcode')
};

export const postCart = {
    payload: {
        list: Joi.string().required(),
        signature: (<any>Joi.string()).base64().required()
    }
};