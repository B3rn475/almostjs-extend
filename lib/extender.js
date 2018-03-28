// Copyright (c) 2016, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
"use strict";

var _ = require('lodash');

function createElementsLookup(elements) {
    return _.chain(elements)
        .map(function (e) { return [e.id, e]; })
        .fromPairs()
        .value();
}

function createRelationsLookup(relations) {
    return _.groupBy(relations, 'type');
}

function createIsTypeChecker(types) {
    return function (element, defaultValue) {
        element = this.toElement(element);
        if (!element) { return !!defaultValue; }
        return _.includes(types, element.type);
    };
}

function createGetRelatedElementsHelper(lookup) {
    return function (id, defaultValue) {
        if (arguments.length > 1 && !Array.isArray(defaultValue)) {
            defaultValue = [defaultValue];
        }
        return lookup[this.toId(id)] || defaultValue || [];
    };
}

function createGetRelatedIdElementHelper(lookup) {
    var getter = createGetRelatedElementsHelper(lookup);
    return function () {
        return _.head(getter.apply(this, arguments));
    };
}

function createGetRelatedElementHelper(lookup) {
    var getter = createGetRelatedIdElementHelper(lookup);
    return function () {
        return this.toElement(getter.apply(this, arguments));
    };
}

function toId(element) {
    if (typeof element === 'string') { return element; }
    return element && element.id;
}

function createToElementHelper(lookup) {
    return function toElement(id) {
        if (typeof id === 'object') { return id; }
        return lookup[id];
    };
}

function createModel(options) {
    function Model(json) {
        if (arguments.length < 1) { throw new Error('missing model argument'); }
        if (!(this instanceof Model)) { return new Model(json); }

        if (!_.isPlainObject(json)) { throw new Error('invalid model argument, it should be a plain object'); }

        if (!_.has(json, 'elements')) { throw new Error('missing elements array'); }
        if (!_.isArray(json.elements)) { throw new Error('invalid elements array'); }
        if (!_.has(json, 'relations')) { throw new Error('missing relations array'); }
        if (!_.isArray(json.relations)) { throw new Error('invalid relations array'); }

        this.elements = json.elements.slice();
        this.relations = json.relations.slice();
        if (_.has(json, 'metadata')) {
            this.metadata = json.metadata;
        }

        var self = this,
            element = createElementsLookup(this.elements),
            relation = createRelationsLookup(this.relations);
        this.toElement = createToElementHelper(element);

        _.forEach(options.relation, function (config, name) {
            var lookup = _.chain(relation[config.relation])
                .groupBy(config.from)
                .mapValues(function (rs) {
                    return _.chain(rs)
                        .map(config.to)
                        .filter()
                        .value();
                })
                .value();
            if (config.single) {
                self['get' + name] = createGetRelatedElementHelper(lookup);
                self['get' + name + 'Id'] = createGetRelatedIdElementHelper(lookup);
            } else {
                self['get' + name] = createGetRelatedElementsHelper(lookup);
            }
        });
    }
    Model.prototype = options.prototype;
    return Model;
}

function createExtender(options) {

    if (arguments.length < 1) { throw new Error('missing options argument'); }
    if (!_.isPlainObject(options)) { throw new Error('invalid options argument, it should be a plain object'); }
    if (_.has(options, 'type') && !_.isPlainObject(options.type)) { throw new Error('invalid type option argument, it should be a plain object'); }
    if (_.has(options, 'relation') && !_.isPlainObject(options.relation)) { throw new Error('invalid relation option argument, it should be a plain object'); }
    if (_.has(options, 'custom') && !_.isPlainObject(options.custom)) { throw new Error('invalid custom option argument, it should be a plain object'); }


    var prototype = {
        toId: toId
    };

    _.forEach(options.type, function (types, name) {
        types = _.flatten([types]);
        _.forEach(types, function (type) {
            if (typeof type !== 'string') { throw new Error('invalid type configuration, it must be a string or an array of strings'); }
        });
        prototype['is' + name] = createIsTypeChecker(types);
    });

    _.forEach(options.relation, function (config) {
        if (!_.isPlainObject(config)) { throw new Error('invalid relation configuration, it must be a plain object'); }
        if (!_.has(config, 'relation')) { throw new Error('invalid relation configuration, missing relation field'); }
        if (typeof config.relation !== 'string') { throw new Error('invalid relation configuration, invalid relation field, it must be a string'); }
        if (!_.has(config, 'from')) { throw new Error('invalid relation configuration, missing from field'); }
        if (typeof config.from !== 'string') { throw new Error('invalid relation configuration, invalid from field, it must be a string'); }
        if (!_.has(config, 'to')) { throw new Error('invalid relation configuration, missing from field'); }
        if (typeof config.to !== 'string') { throw new Error('invalid relation configuration, invalid to field, it must be a string'); }
    });

    _.forEach(options.custom, function (method, name) {
        if (typeof method !== 'function') { throw new Error('a custom helper must be a function'); }
        prototype[name] = method;
    });

    return createModel({prototype: prototype, relation: options.relation});
}

module.exports = createExtender;
