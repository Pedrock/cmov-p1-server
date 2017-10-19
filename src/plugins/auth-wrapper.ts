import * as Boom from 'boom';
import * as Blacklist from 'express-jwt-blacklist';

export const register = function register(server, options, next) {
    Blacklist.configure({
        tokenId: 'jti',
        store: {
            type: 'redis',
            client: server.app.redis
        }
    });

    const adminScheme = function (server, options) {
        return {
            authenticate: async function (request, reply) {
                const req = request.raw.req;
                const token = req.headers.authorization;
                if (!token || token !== process.env.ADMIN_TOKEN) {
                    return reply(Boom.unauthorized(null, 'token'));
                }
                return reply.continue({ credentials: { admin: true }});
            }
        };
    };

    server.auth.scheme('admin', adminScheme);
    server.auth.strategy('admin', 'admin');

    server.auth.strategy('user', 'jwt', {
        key: process.env.JWT_SECRET,
        validateFunc: (decoded, request, callback) => {
            Blacklist.isRevoked(null, decoded, (error, revoked) => {
                callback(error, !revoked);
            });
        },
        verifyOptions: { algorithms: ['HS256'] }
    });

    next();
};

(<any>register).attributes = {
    name: 'auth-wrapper',
    version: '1.0.0'
};