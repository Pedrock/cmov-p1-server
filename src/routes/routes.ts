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
            },
            {
                method: 'POST',
                path: '/purchase',
                config: {
                    tags: ['api'],
                    auth: 'user',
                    handler: Handlers.postPurchase,
                    validate: Schema.postPurchase
                }
            },
            {
                method: 'GET',
                path: '/admin/purchase/{token}',
                config: {
                    tags: ['api'],
                    auth: 'admin',
                    handler: Handlers.getPurchase,
                    validate: Schema.getPurchase
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
