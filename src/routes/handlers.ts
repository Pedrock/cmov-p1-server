'use strict';

import * as Boom from 'boom';
import { Repository } from 'typeorm';
import * as Joi from 'joi';
import * as Crypto from 'crypto';
import { Verify } from 'crypto';
import * as Big from 'big.js';
import * as _ from 'lodash';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import {camelCaseObject, processPayment} from './utils';
import {Purchase} from '../entities/Purchase';

export const register = async function (request, reply) {
    const userRepository: Repository<User> = request.getManager().getRepository(User);
    const payload = camelCaseObject(request.payload);

    userRepository.createQueryBuilder('user')
        .insert()
        .values(payload)
        .returning('id, token')
        .execute()
        .then(([user]) => {
            if (!user) {
                throw Boom.internal();
            }
            reply(user);
        })
        .catch(reply);
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

export const postPurchase = async function (request, reply) {
    const listSchema = Joi.array().items({
        barcode: Joi.string().regex(/^[0-9]{11}$/, 'barcode').required(),
        quantity: Joi.number().integer().positive().required()
    }).min(1);

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

    processPayment(request, products, total)
        .then(reply, reply);
};

export const getPurchase = async function(request, reply) {
    const purchaseRepository: Repository<Purchase> = request.getManager().getRepository(Purchase);
    purchaseRepository
        .createQueryBuilder('purchase')
        .select()
        .addSelect(['user.id', 'user.name', 'user.address', 'user.fiscalNumber'])
        .leftJoin('purchase.user', 'user')
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
    const user: User = request.auth.credentials.user;
    const purchases = await user.purchases || [];
    reply(purchases);
};