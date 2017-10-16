import * as Boom from 'boom';
import {User} from '../entities/User';
import {Repository} from 'typeorm';

export const register = function register(server, options, next) {

    const adminScheme = function (server, options) {
        return {
            authenticate: async function (request, reply) {
                const req = request.raw.req;
                const authorization = req.headers.authorization;
                if (!authorization || authorization !== process.env.ADMIN_TOKEN) {
                    return reply(Boom.unauthorized(null, 'token'));
                }
                return reply.continue({ credentials: { roles: ['admin'] } });
            }
        };
    };

    const userScheme = function (server, options) {
        return {
            authenticate: async function (request, reply) {
                const req = request.raw.req;
                const authorization = req.headers.authorization;
                if (!authorization) {
                    return reply(Boom.unauthorized(null, 'token'));
                }
                const userRepository: Repository<User> = request.getManager().getRepository(User);
                const user = await userRepository.findOneById(authorization).catch(() => null);
                if (!user) {
                    return reply(Boom.unauthorized('Invalid token', 'token'));
                }
                return reply.continue({ credentials: { user } });
            }
        };
    };

    server.auth.scheme('user', userScheme);
    server.auth.strategy('user', 'user');
    server.auth.scheme('admin', adminScheme);
    server.auth.strategy('admin', 'admin');
    next();
};

(<any>register).attributes = {
    name: 'auth-wrapper',
    version: '1.0.0'
};