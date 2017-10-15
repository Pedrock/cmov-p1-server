'use strict';
import * as Crypto from 'crypto';
import * as Lab from 'lab';
import {Server} from 'hapi';

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
const publicKey = `-----BEGIN PUBLIC KEY-----
MEowDQYJKoZIhvcNAQEBBQADOQAwNgIvALxEBIS8mCOUi/Gf8b2/URBkakw2um8q
LTUGy2JnwZAaui5yM7KTJrBmjF6pfaMCAwEAAQ==
-----END PUBLIC KEY-----`;
const list = '[{"barcode": "12345678901", "quantity": 1}]';

const credentials = {
    user: {
        token: 'test_token',
        publicKey
    }
};

let server: Server;
let signature: string;

describe('buying:', async () => {

    before(async () => {
        server = await require('../src/server')();

        const sign = Crypto.createSign('RSA-SHA1');
        sign.update(list);
        signature = sign.sign(privateKey, 'base64');
    });

    it('can buy', async () => {
        const request = {
            method: 'POST',
            url: '/api/cart',
            payload: { list, signature },
            credentials
        };
        const { statusCode } = await server.inject(request);
        expect(statusCode).to.equal(200);
    });
});
