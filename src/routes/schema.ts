import * as BaseJoi from 'joi';
import * as JoiDateExtensions from 'joi-date-extensions';
import JoiNifExtension from '../lib/joi-nif-extension';
const Joi = BaseJoi.extend(<any>[JoiDateExtensions, JoiNifExtension]);

export const register = {
    payload: {
        name: Joi.string().required(),
        address: Joi.string().required(),
        fiscal_number: Joi.string().nif().required(),
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

export const postPurchase = {
    payload: {
        list: Joi.string().required(),
        signature: (<any>Joi.string()).base64().required()
    }
};

export const getPurchase = {
    params: Joi.object().keys({
        token: Joi.string().uuid('uuidv4')
    })
};