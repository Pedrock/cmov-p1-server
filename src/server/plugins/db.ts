'use strict';
import {Repository} from 'typeorm';
import {User} from '../entities/User';
import * as Boom from 'boom';

const Typeorm = require('typeorm');

let connectionCreated = false;

const getRequestUser = async function() {
    const userRepository: Repository<User> = this.getManager().getRepository(User);
    const id = this.auth.credentials.id;
    const user = await userRepository.findOneById(id).catch(() => null);
    if (!user) {
        throw Boom.notFound('User not found');
    }
    return user;
};

const decorateServer = function(server) {
    server.decorate('request', 'getManager', Typeorm.getManager);
    server.decorate('request', 'getRequestUser', getRequestUser);
};

export const register = function register(server, options, next) {
    if (connectionCreated) { // Fixes tests
        decorateServer(server);
        return next();
    }
    Typeorm.createConnection().then(() => {
        console.log('Connected to database successfully');
        decorateServer(server);
        connectionCreated = true;
        next();
    }).catch((error) => process.nextTick(() => {
        throw error;
    }));
};

(<any>register).attributes = {
    name: 'db-wrapper',
    version: '1.0.0'
};

