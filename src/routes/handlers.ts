'use strict';

import * as Boom from 'boom';
import { Repository } from 'typeorm';
import * as Joi from 'joi';
import * as Crypto from 'crypto';
import { Verify } from 'crypto';
import * as Big from 'big.js';
import * as _ from 'lodash';
import * as Bcrypt from 'bcrypt';
import * as Cryptiles from 'cryptiles';
import * as JWT from 'jsonwebtoken';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import {camelCaseObject, processPayment} from './utils';
import {Purchase} from '../entities/Purchase';

const _login = function (user) {
    const obj = _.pick(user, ['id', 'username']);
    const jwtid = Cryptiles.randomString(64);
    const token = JWT.sign(obj, process.env.JWT_SECRET, { jwtid });
    return { token };
};

export const login = async function (request, reply) {
    const userRepository = request.getManager().getRepository('User');
    userRepository.findOne({ username: request.payload.username })
        .then(async (user) => {
            if (!user) {
                throw Boom.forbidden('Invalid username/password');
            }
            const success = await Bcrypt.compare(request.payload.password, user.password);
            if (!success) {
                throw Boom.forbidden('Invalid username/password');
            }
            user.publicKey = request.payload.public_key;
            await userRepository.save(user);
            reply(_login(user));
        })
        .catch(reply);
};

export const register = async function (request, reply) {
    const userRepository: Repository<User> = request.getManager().getRepository(User);
    const payload = camelCaseObject(request.payload);

    userRepository.createQueryBuilder('user')
        .insert()
        .values({
            ...payload,
            password: await Bcrypt.hash(payload.password, 10)
        })
        .returning('*')
        .execute()
        .then(([user]) => {
            if (!user) {
                throw Boom.internal();
            }
            reply(_login(user));
        })
        .catch((error) => {
            if (error.constraint === 'uk_user_username') {
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

export const getProducts = async function (request, reply) {
    const productRepository: Repository<Product> = request.getManager().getRepository(Product);
    const barcodes = request.query.barcodes.split(',');
    productRepository
        .createQueryBuilder('product')
        .where('barcode IN (:barcodes)', { barcodes })
        .getMany()
        .then(reply, reply);
};

export const postPurchase = async function (request, reply) {
    const listSchema = Joi.array().items({
        barcode: Joi.string().regex(/^[0-9]{11}$/, 'barcode').required(),
        quantity: Joi.number().integer().positive().required()
    }).min(1).unique((a, b) => a.barcode === b.barcode);

    const { error, value: list } = listSchema.validate(request.payload.list);
    if (error) {
        return reply(Boom.badRequest(<any>error));
    }

    const verify: Verify = Crypto.createVerify('RSA-SHA1');
    verify.update(request.payload.list);
    const user = await request.getRequestUser();
    const publicKey: string = user.publicKey;
    let valid = false;
    try {
        valid = verify.verify(publicKey, request.payload.signature, 'base64');
    } catch (error) {
        console.log(error);
    }
    if (!valid) {
        return reply(Boom.badRequest('Signature doesn\'t match shopping list'));
    }

    const barcodes = list.map(item => item.barcode);

    const productRepository: Repository<Product> = request.getManager().getRepository(Product);
    const products = await productRepository
        .createQueryBuilder('product')
        .where('barcode IN (:barcodes)', { barcodes })
        .getMany();

    if (products.length !== barcodes.length) {
        return reply(Boom.badData('Some of the products could not be found'));
    }

    const quantities: Map<string, number> = new Map();
    list.forEach(item => quantities.set(item.barcode, item.quantity));

    let total = Big(0);
    for (const product of products) {
        (<any>product).quantity = quantities.get(product.barcode);
        total = total.plus(Big(product.price).times((<any>product).quantity));
    }
    total = total.toString();

    processPayment(request, user, products, total)
        .then(reply, reply);
};

export const getPurchase = async function(request, reply) {
    const purchaseRepository: Repository<Purchase> = request.getManager().getRepository(Purchase);
    purchaseRepository
        .createQueryBuilder('purchase')
        .select()
        .addSelect(['user.id', 'user.name', 'user.address', 'user.fiscalNumber'])
        .leftJoin('purchase.user', 'user')
        .where('purchase.token = :token', { token: request.params.token })
        .getOne()
        .then((purchase) => {
            if (!purchase) {
                return Boom.notFound('Purchase not found');
            }
            return purchase;
        })
        .then(reply, reply);
};

export const getPurchases = async function(request, reply) {
    const user: User = await request.getRequestUser();
    const purchases = await user.purchases || [];
    reply(purchases);
};