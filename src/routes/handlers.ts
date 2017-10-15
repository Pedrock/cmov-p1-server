'use strict';

import * as Boom from 'boom';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import {Product} from '../entities/Product';

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
