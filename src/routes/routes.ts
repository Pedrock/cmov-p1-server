'use strict';

import * as Handlers from './handlers';
import * as Schema from './schema';

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
            },
            {
                method: 'GET',
                path: '/product',
                config: {
                    tags: ['api'],
                    handler: Handlers.getProduct,
                    validate: Schema.getProduct
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
