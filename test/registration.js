'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const expect = Lab.expect;

let server;

const requestDefaults = {
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
        public_key: 'XXXXX'
    }
};

describe('math', async () => {

    before(async () => {
        server = await require('../src/server')();
    });

    it('returns true when 1 + 1 equals 2', async () => {
        const request = { ...requestDefaults };
        const { statusCode, result } = await server.inject(request);
        console.log(result);
        expect(statusCode).to.equal(200);
    });
});
