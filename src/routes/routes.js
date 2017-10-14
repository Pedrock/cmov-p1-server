'use strict';

const Handlers = require('./handlers');
const Schema = require('./schema');

module.exports = {
    register: function (server, options, next) {
        server.route([
            {
                method: 'POST',
                path: '/register',
                config: {
                    tags: ['api'],
                    plugins: { dsc: false }, // Disable double submit cookies for this route
                    handler: Handlers.register,
                    validate: Schema.register
                }
            }
        ]);
        next();
    }
};

module.exports.register.attributes = {
    name: 'routes',
    version: '1.0.0'
};
