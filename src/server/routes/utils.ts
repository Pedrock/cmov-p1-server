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

export const processPayment = async function(request: Request, user: User, products: Product[], total: string) {
    const expiration = moment(user.creditCardExpiration).endOf('month');

    if (moment().isAfter(expiration)) {
        throw Boom.badData('Credit card has expired.');
    }
    if (Math.random() < request.server.settings.app.purchaseFailureRate) {
        throw Boom.paymentRequired('Payment failed. Please try again.');
    }

    const purchaseRepository: Repository<Purchase> = Typeorm.getManager().getRepository(Purchase);
    return purchaseRepository
        .createQueryBuilder('purchase')
        .insert()
        .values({ user: <any>(user.id), products: JSON.stringify(products), total })
        .returning('*')
        .execute()
        .then(([purchase]) => _.pick(purchase, ['id', 'token', 'products', 'total', 'date']));
};