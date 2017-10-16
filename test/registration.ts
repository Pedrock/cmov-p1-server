'use strict';

import * as Lab from 'lab';
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const expect = Lab.expect;

let server;

const publicKey = `-----BEGIN PUBLIC KEY-----
MEowDQYJKoZIhvcNAQEBBQADOQAwNgIvALxEBIS8mCOUi/Gf8b2/URBkakw2um8q
LTUGy2JnwZAaui5yM7KTJrBmjF6pfaMCAwEAAQ==
-----END PUBLIC KEY-----`;

export const registrationRequest = {
    method: 'POST',
    url: '/api/register',
    payload: {
        name: 'Test',
        address: 'test street',
        fiscal_number: '123456789',
        credit_card_type: 'visa',
        credit_card_number: '341116922703147',
        credit_card_expiration: '2018-02',
        credit_card_cvv: '123',
        public_key: publicKey
    }
};

describe('registration:', async () => {

    before(async () => {
        server = await require('../src/server')();
    });

    it('user is registered', async () => {
        const { statusCode } = await server.inject(registrationRequest);
        expect(statusCode).to.equal(200);
    });
});
