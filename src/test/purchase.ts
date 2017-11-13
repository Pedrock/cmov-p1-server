'use strict';
import * as Crypto from 'crypto';
import * as Lab from 'lab';
import {Server} from 'hapi';
import {registrationRequest} from './auth';

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const expect = Lab.expect;

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIHpAgEAAi8AvEQEhLyYI5SL8Z/xvb9REGRqTDa6byotNQbLYmfBkBq6LnIzspMm
sGaMXql9owIDAQABAi4kCxWeYAj0juT3/nomrLEVZVQggT3SODmfu/tDITAgnqey
rRGp3Ck0Zr+6o/H5AhgA7NpmqNHU/Vwc5XX0/wyz+W4DtEjSgs0CGADLfB2InqRz
aPZ/6vi4X3vp2xXRq7ViLwIYAMWazO1p6u3aLM2P5O/pFDo0e+isnNy9Ahc5Igsk
ze48nU8A0ZeuJNkk6yewLDcMbwIXAhGbpJQZ7KWBpH6SOOiZ2m556dhxaLg=
-----END RSA PRIVATE KEY-----`;
const list = '[{"barcode": "12853478357", "quantity": 3}, {"barcode": "61234567890", "quantity": 1}]';

let server: Server;
let userToken;
let purchaseToken;


function signList(list) {
    const sign = Crypto.createSign('RSA-SHA1');
    sign.update(list);
    return sign.sign(privateKey, 'base64');
}

describe('buying:', async () => {

    before(async () => {
        server = await require('../server')();
        server.settings.app.purchaseFailureRate = 0;

        const { result } = await server.inject(registrationRequest());
        userToken = (<any>result).token;
    });

    it('can buy', async () => {
        const request = {
            method: 'POST',
            url: '/api/purchase',
            payload: { list, signature: signList(list) },
            headers: { Authorization: userToken }
        };
        const { statusCode, payload, result } = await server.inject(request);
        expect(statusCode).to.equal(200);
        purchaseToken = (<any>result).token;
        expect(Object.keys(JSON.parse(payload))).to.equal(['id', 'token', 'products', 'total', 'date']);
    });

    it('can not buy empty purchase', async () => {
        const request = {
            method: 'POST',
            url: '/api/purchase',
            payload: { list: '[]', signature: signList('[]') },
            headers: { Authorization: userToken }
        };
        const { statusCode } = await server.inject(request);
        expect(statusCode).to.equal(400);
    });

    it('purchase is available', async () => {
        const request = {
            method: 'GET',
            url: `/api/admin/purchase/${purchaseToken}`,
            headers: { Authorization: process.env.ADMIN_TOKEN }
        };
        const { statusCode, payload } = await server.inject(request);
        expect(statusCode).to.equal(200);
        expect(Object.keys(JSON.parse(payload))).to.equal(['id', 'token', 'products', 'total', 'date', 'user']);
        expect(JSON.parse(payload).token).to.equal(purchaseToken);
    });

});
