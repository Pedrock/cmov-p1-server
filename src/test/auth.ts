'use strict';

import * as Lab from 'lab';
import * as _ from 'lodash';
import * as Cryptiles from 'cryptiles';
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const expect = Lab.expect;

let server, username;

const publicKey = `-----BEGIN PUBLIC KEY-----
MEowDQYJKoZIhvcNAQEBBQADOQAwNgIvALxEBIS8mCOUi/Gf8b2/URBkakw2um8q
LTUGy2JnwZAaui5yM7KTJrBmjF6pfaMCAwEAAQ==
-----END PUBLIC KEY-----`;

export const registrationRequest = () => {
    username = Cryptiles.randomString(8);
    return {
        method: 'POST',
        url: '/api/auth/register',
        payload: {
            name: 'Test',
            address: 'test street',
            fiscal_number: '123456789',
            credit_card_type: 'visa',
            credit_card_number: '341116922703147',
            credit_card_expiration: '2018-02',
            credit_card_cvv: '123',
            public_key: publicKey,
            username,
            password: 'password1'
        }
    };
};

export const loginRequest = () => ({
    method: 'POST',
    url: '/api/auth/login',
    payload: { username, password: 'password1', public_key: publicKey }
});

describe('auth:', async () => {

    before(async () => {
        server = await require('../server')();
    });

    it('user is registered', async () => {
        const { statusCode } = await server.inject(registrationRequest());
        expect(statusCode).to.equal(200);
    });

    it('login', async () => {
        const { statusCode } = await server.inject(loginRequest());
        expect(statusCode).to.equal(200);
    });

    it('fails with invalid nif', async () => {
        const { statusCode } = await server.inject(_.merge({}, registrationRequest(), { payload: {
            fiscal_number: '123456788',
        }}));
        expect(statusCode).to.equal(400);
    });
});
