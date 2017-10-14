import * as Joi from 'joi';

exports.register = {
    payload: {
        name: Joi.string().required(),
        address: Joi.string().required(),
        fiscal_number: Joi.string().regex(/^[0-9]{9}$/, 'fiscal number').required(), // TODO - better validation
        credit_card_number: Joi.string().creditCard().required(),
        credit_card_type: Joi.string().valid('visa', 'mastercard', 'american express').required(),
        credit_card_expiration: Joi.date().required(), // TODO - better validation
        credit_card_cvv: Joi.string().regex(/^[0-9]{3}$/, 'CVV').required(),
        public_key: Joi.string().required()
    }
};