'use strict';

const _ = require('lodash');

module.exports.camelCaseObject = function (object) {
    return _.transform(object, (result, value, key) => {
        result[_.camelCase(key)] = value;
    }, {});
};
