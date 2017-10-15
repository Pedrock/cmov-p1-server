'use strict';

import * as Boom from 'boom';
import { Repository } from 'typeorm';
import * as Joi from 'joi';
import * as Crypto from 'crypto';
import { Verify } from 'crypto';
import { User } from '../entities/User';
import { Product } from '../entities/Product';

const { camelCaseObject } = require('./utils');

export const register = async function (request, reply) {
    const userRepository: Repository<User> = request.getManager().getRepository(User);
    const payload = camelCaseObject(request.payload);

    userRepository.createQueryBuilder('user')
        .insert()
        .values(payload)
        .returning('*')
        .execute()
        .then(([user]) => {
            if (!user) {
                throw Boom.internal();
            }
            reply({ id: user.id });
        })
        .catch((error) => {
            if (error.constraint === 'user_username_idx') {
                reply(Boom.conflict('Username already in use'));
            } else {
                reply(error);
            }
        });
};

export const getProduct = async function (request, reply) {
    const productRepository: Repository<Product> = request.getManager().getRepository(Product);
    productRepository.findOne(request.query)
        .then(product => {
            if (!product) throw Boom.notFound('Product not found');
            return product;
        })
        .then(reply, reply);
};

export const postCart = async function (request, reply) {
    const listSchema = Joi.array().items({
        barcode: Joi.string().regex(/^[0-9]{11}$/, 'barcode').required(),
        quantity: Joi.number().integer().positive().required()
    });

    const { error, value: list } = listSchema.validate(request.payload.list);
    if (error) return reply(Boom.badRequest(<any>error));

    const verify: Verify = Crypto.createVerify('RSA-SHA1');
    verify.update(request.payload.list);
    const publicKey: string = request.auth.credentials.user.publicKey;
    let valid = false;
    try {
        valid = verify.verify(publicKey, request.payload.signature, 'base64');
    } catch (error) {
        console.log(error);
    }
    if (!valid) {
        return reply(Boom.badRequest('Signature doesn\'t match shopping list'));
    }
    reply(list);
};