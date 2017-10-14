'use strict';

const Boom = require('boom');
const { camelCaseObject } = require('./utils');

exports.register = async function (request, reply) {
    const userRepository = request.getManager().getRepository('User');
    const payload = camelCaseObject(request.payload);

    userRepository.save(payload).then((user) => {
        reply({
            id: user.id,
            token: user.token
        });
    }).catch((error) => {
        if (error.constraint === 'user_username_idx') {
            reply(Boom.conflict('Username already in use'));
        } else {
            reply(error);
        }
    });
};
