import * as _ from 'lodash';
import * as moment from 'moment';
import * as Boom from 'boom';
import * as Typeorm from 'typeorm';
import {Product} from '../entities/Product';
import {User} from '../entities/User';
import {Purchase} from '../entities/Purchase';
import {Repository} from 'typeorm';
import {Request} from 'hapi';

export const camelCaseObject = function (object: Object) {
    return _.transform(object, (result, value, key) => {
        result[_.camelCase(key)] = value;
    }, {});
};

export const processPayment = async function(request: Request, products: Product[], total: string) {
    const user: User = request.auth.credentials.user;
    const expiration = moment(user.creditCardExpiration).endOf('month');
    if (moment().isAfter(expiration)) {
        throw Boom.badData('Credit card has expired');
    }
    if (Math.random() < request.server.settings.app.purchaseFailureRate) {
        throw Boom.internal('Payment failed for unknown reason');
    }

    const purchaseRepository: Repository<Purchase> = Typeorm.getManager().getRepository(Purchase);
    return purchaseRepository
        .createQueryBuilder('purchase')
        .insert()
        .values({ user: <any>(user.id), products, total })
        .returning('*')
        .execute()
        .then(([{ id, products, total, createdDate: date }]) => ({ id, products, total, date }));
};