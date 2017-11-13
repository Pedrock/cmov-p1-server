import * as Joi from 'joi';

const isValidNif = function (nif) {
    if (isNaN(parseInt(nif, 10)) || !nif.length || nif.length !== 9) {
        return false;
    }
    let splitNif = nif.split('');
    let checkDigit = 0;
    for (let i = 0; i < 8; i++) {
        checkDigit += (9 - i) * splitNif[i];
    }
    checkDigit = 11 - (checkDigit % 11);
    if (checkDigit >= 10) {
        checkDigit = 0;
    }
    return (checkDigit === Number(splitNif[8]));
};

const extension = {
    name: 'string',
    base: Joi.string(),
    language: {
        nif: 'must be a valid NIF'
    },
    rules: [
        {
            name: 'nif',
            description: 'Should be a valid NIF',
            validate(params, value, state, options) {
                if (!isValidNif(value)) {
                    return this.createError('string.nif', { v: value }, state, options);
                }
                return value;
            }
        }
    ]
};

export default extension;