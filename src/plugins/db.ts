'use strict';

const Typeorm = require('typeorm');

let connectionCreated = false;

export const register = function register(server, options, next) {
    if (connectionCreated) { // Fixes tests
        server.decorate('request', 'getManager', Typeorm.getManager);
        return next();
    }
    Typeorm.createConnection().then(() => {
        console.log('Connected to database successfully');
        server.decorate('request', 'getManager', Typeorm.getManager);
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

