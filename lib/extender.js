// Copyright (c) 2016, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by a MIT-style license that can be found in the LICENSE file.
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
    return element.id;
}

function createToElementHelper(lookup) {
    return function toElement(id) {
        if (typeof id === 'object') { return id; }
        return lookup[id];
    };
}

function createModel(options) {
    function Model(json) {
        if (!(this instanceof Model)) { return new Model(json); }

        this.elements = json.elements.slice();
        this.relations = json.relations.slice();

        var self = this,
            element = createElementsLookup(this.elements),
            relation = createRelationsLookup(this.relations);
        this.toELement = createToElementHelper(element);

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

function Extender(options) {

    var prototype = {
        toId: toId
    };

    _.forEach(options.type, function (types, name) {
        if (!Array.isArray(types) && typeof types !== 'string') {
            throw new Error('a type must be a string or an array of strings');
        }
        if (Array.isArray(types)) {
            types = types.slice();
        } else {
            types = [types];
        }
        prototype['is' + name] = createIsTypeChecker(types);
    });

    _.forEach(options.custom, function (method, name) {
        prototype[name] = method;
    });

    return createModel({prototype: prototype, relation: options.relation});
}

module.exports = Extender;
