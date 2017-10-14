'use strict';

import * as Boom from 'boom';
import { Repository } from 'typeorm';
import { User } from '../entities/User';

const { camelCaseObject } = require('./utils');

export const register = async function (request, reply) {
    const userRepository: Repository<User> = request.getManager().getRepository('User');
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
