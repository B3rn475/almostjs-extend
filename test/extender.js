// Copyright (c) 2018, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true*/
/*global describe, it, beforeEach*/
"use strict";

var _ = require('lodash'),
    assert = require('assert'),
    sinon = require('sinon'),
    create = require('../lib/extender');

describe('extender', function () {
    describe('empty', function () {
        var extend;
        beforeEach(function () {
            extend = create({});
        });
        it('should throw with no arguments', function () {
            assert.throws(function () { extend(); });
        });
        it('should throw with invalid model', function () {
            assert.throws(function () { extend(undefined); });
            assert.throws(function () { extend(null); });
            assert.throws(function () { extend(0); });
            assert.throws(function () { extend(1); });
            assert.throws(function () { extend(false); });
            assert.throws(function () { extend(true); });
            assert.throws(function () { extend(''); });
            assert.throws(function () { extend('value'); });
            assert.throws(function () { extend(/ /); });
            assert.throws(function () { extend(sinon.spy()); });
        });
        it('should throw with missing elements field', function () {
            var model = {
                relations: []
            };
            assert.throws(function () { extend(model); });
        });
        it('should throw with invalid elements field', function () {
            function test(elements) {
                var model = {
                    elements: elements,
                    relations: []
                };
                extend(model);
            }
            assert.throws(function () { test(undefined); });
            assert.throws(function () { test(null); });
            assert.throws(function () { test(0); });
            assert.throws(function () { test(1); });
            assert.throws(function () { test(false); });
            assert.throws(function () { test(true); });
            assert.throws(function () { test(''); });
            assert.throws(function () { test('value'); });
            assert.throws(function () { test(/ /); });
            assert.throws(function () { test(sinon.spy()); });
            assert.throws(function () { test({}); });
        });
        it('should preserve elements', function () {
            var origin = {
                    elements: [{id: '1'}, {id: '2'}],
                    relations: []
                },
                extended = extend(origin);
            assert.deepEqual(origin.relations, extended.relations);
        });
        it('should throw with missing relations field', function () {
            var model = {
                elements: []
            };
            assert.throws(function () { extend(model); });
        });
        it('should throw with invalid relations field', function () {
            function test(relations) {
                var model = {
                    elements: [],
                    relations: relations
                };
                extend(model);
            }
            assert.throws(function () { test(undefined); });
            assert.throws(function () { test(null); });
            assert.throws(function () { test(0); });
            assert.throws(function () { test(1); });
            assert.throws(function () { test(false); });
            assert.throws(function () { test(true); });
            assert.throws(function () { test(''); });
            assert.throws(function () { test('value'); });
            assert.throws(function () { test(/ /); });
            assert.throws(function () { test(sinon.spy()); });
            assert.throws(function () { test({}); });
        });
        it('should preserve relations', function () {
            var origin = {
                    elements: [],
                    relations: [{type: '1'}, {type: '2'}]
                },
                extended = extend(origin);
            assert.deepEqual(origin.relations, extended.relations);
        });
        it('should not attach metadata if missing', function () {
            var origin = {
                    relations: [],
                    elements: []
                },
                extended = extend(origin);
            assert.ok(!_.has(extended, 'metadata'));
        });
        it('should preserve metadata', function () {
            var origin = {
                    relations: [],
                    elements: [],
                    metadata: {}
                },
                extended = extend(origin);
            assert.equal(origin.metadata, extended.metadata);
        });
        describe('toElement', function () {
            it('should be a function', function () {
                var origin = {
                        elements: [],
                        relations: []
                    },
                    extended = extend(origin);
                assert.equal(typeof extended.toElement, 'function');
            });
            it('should return the element passing an id', function () {
                var element = {id: '1'},
                    origin = {
                        elements: [element, {id: '2'}],
                        relations: []
                    },
                    extended = extend(origin);
                assert.equal(extended.toElement(element.id), element);
            });
            it('should return the element padding an element', function () {
                var element = {id: '1'},
                    origin = {
                        elements: [element, {id: '2'}],
                        relations: []
                    },
                    extended = extend(origin);
                assert.equal(extended.toElement(element), element);
            });
        });
        describe('toId', function () {
            it('should be a function', function () {
                var origin = {
                        elements: [],
                        relations: []
                    },
                    extended = extend(origin);
                assert.equal(typeof extended.toId, 'function');
            });
            it('should return the id passing an id', function () {
                var element = {id: '1'},
                    origin = {
                        elements: [element, {id: '2'}],
                        relations: []
                    },
                    extended = extend(origin);
                assert.equal(extended.toId(element.id), element.id);
            });
            it('should return the id padding an element', function () {
                var element = {id: '1'},
                    origin = {
                        elements: [element, {id: '2'}],
                        relations: []
                    },
                    extended = extend(origin);
                assert.equal(extended.toId(element), element.id);
            });
        });
    });
    describe('type', function () {
        var extend;
        beforeEach(function () {
            extend = create({
                type: {
                    Single: 'type.Single',
                    Multiple: ['type.Multiple1', 'type.Multiple2']
                }
            });
        });
        it('should be a function', function () {
            var extended = extend({
                elements: [],
                relations: []
            });
            assert.equal(typeof extended.isSingle, 'function');
            assert.equal(typeof extended.isMultiple, 'function');
        });
        it('should work with element', function () {
            var single = {
                    id: 'single',
                    type: 'type.Single'
                },
                multiple1 = {
                    id: 'multiple1',
                    type: 'type.Multiple1'
                },
                multiple2 = {
                    id: 'multiple2',
                    type: 'type.Multiple2'
                },
                extended = extend({
                    elements: [single, multiple1, multiple2],
                    relations: []
                });
            assert.equal(extended.isSingle(single), true);
            assert.equal(extended.isSingle(multiple1), false);
            assert.equal(extended.isSingle(multiple2), false);
            assert.equal(extended.isMultiple(single), false);
            assert.equal(extended.isMultiple(multiple1), true);
            assert.equal(extended.isMultiple(multiple2), true);
        });
        it('should work with id', function () {
            var single = {
                    id: 'single',
                    type: 'type.Single'
                },
                multiple1 = {
                    id: 'multiple1',
                    type: 'type.Multiple1'
                },
                multiple2 = {
                    id: 'multiple2',
                    type: 'type.Multiple2'
                },
                extended = extend({
                    elements: [single, multiple1, multiple2],
                    relations: []
                });
            assert.equal(extended.isSingle(single.id), true);
            assert.equal(extended.isSingle(multiple1.id), false);
            assert.equal(extended.isSingle(multiple2.id), false);
            assert.equal(extended.isMultiple(single.id), false);
            assert.equal(extended.isMultiple(multiple1.id), true);
            assert.equal(extended.isMultiple(multiple2.id), true);
        });
        it('should work apply default with missing id', function () {
            var extended = extend({
                    elements: [],
                    relations: []
                });
            assert.equal(extended.isSingle('unkown', true), true);
            assert.equal(extended.isSingle('unkown', false), false);
            assert.equal(extended.isMultiple('unkown', true), true);
            assert.equal(extended.isMultiple('unkown', false), false);
        });
    });
    describe('relation', function () {
        describe('single', function () {
            var extend;
            beforeEach(function () {
                extend = create({
                    relation: {
                        Name: {
                            relation: 'type.Relation',
                            from: 'ref1',
                            to: 'ref2',
                            single: true
                        },
                    }
                });
            });
            it('should be a function', function () {
                var extended = extend({
                    elements: [],
                    relations: []
                });
                assert.equal(typeof extended.getName, 'function');
                assert.equal(typeof extended.getNameId, 'function');
            });
            it('should return an element from element', function () {
                var source = {
                        id: 'source'
                    },
                    target = {
                        id: 'target'
                    },
                    extended = extend({
                        elements: [source, target],
                        relations: [{
                            type: 'type.Relation',
                            ref1: 'source',
                            ref2: 'target'
                        }]
                    });
                assert.equal(extended.getName(source), target);
            });
            it('should return an element from id', function () {
                var source = {
                        id: 'source'
                    },
                    target = {
                        id: 'target'
                    },
                    extended = extend({
                        elements: [source, target],
                        relations: [{
                            type: 'type.Relation',
                            ref1: 'source',
                            ref2: 'target'
                        }]
                    });
                assert.equal(extended.getName(source.id), target);
            });
            it('should return an id from element', function () {
                var source = {
                        id: 'source'
                    },
                    target = {
                        id: 'target'
                    },
                    extended = extend({
                        elements: [source, target],
                        relations: [{
                            type: 'type.Relation',
                            ref1: 'source',
                            ref2: 'target'
                        }]
                    });
                assert.equal(extended.getNameId(source), target.id);
            });
            it('should return an id from id', function () {
                var source = {
                        id: 'source'
                    },
                    target = {
                        id: 'target'
                    },
                    extended = extend({
                        elements: [source, target],
                        relations: [{
                            type: 'type.Relation',
                            ref1: 'source',
                            ref2: 'target'
                        }]
                    });
                assert.equal(extended.getNameId(source.id), target.id);
            });
        });
        describe('multiple', function () {
            var extend;
            beforeEach(function () {
                extend = create({
                    relation: {
                        Name: {
                            relation: 'type.Relation',
                            from: 'ref1',
                            to: 'ref2'
                        },
                    }
                });
            });
            it('should be a function', function () {
                var extended = extend({
                    elements: [],
                    relations: []
                });
                assert.equal(typeof extended.getName, 'function');
                assert.ok(!_.has(extended, 'getNameId'));
            });
            it('should return ids from element', function () {
                var source = {
                        id: 'source'
                    },
                    target1 = {
                        id: 'target1'
                    },
                    target2 = {
                        id: 'target2'
                    },
                    extended = extend({
                        elements: [source, target1, target2],
                        relations: [{
                            type: 'type.Relation',
                            ref1: 'source',
                            ref2: 'target1'
                        }, {
                            type: 'type.Relation',
                            ref1: 'source',
                            ref2: 'target2'
                        }]
                    }),
                    targets = extended.getName(source);
                assert.ok(_.isArray(targets));
                assert.equal(targets.length, 2);
                assert.equal(_.xor(targets, [target1.id, target2.id]).length, 0);
            });
            it('should return ids from id', function () {
                var source = {
                        id: 'source'
                    },
                    target1 = {
                        id: 'target1'
                    },
                    target2 = {
                        id: 'target2'
                    },
                    extended = extend({
                        elements: [source, target1, target2],
                        relations: [{
                            type: 'type.Relation',
                            ref1: 'source',
                            ref2: 'target1'
                        }, {
                            type: 'type.Relation',
                            ref1: 'source',
                            ref2: 'target2'
                        }]
                    }),
                    targets = extended.getName(source);
                assert.ok(_.isArray(targets));
                assert.equal(targets.length, 2);
                assert.equal(_.xor(targets, [target1.id, target2.id]).length, 0);
            });
            it('should return empty array for missing id', function () {
                var source = {
                        id: 'source'
                    },
                    target = {
                        id: 'target'
                    },
                    extended = extend({
                        elements: [source, target],
                        relations: [{
                            type: 'type.Relation',
                            ref1: 'source',
                            ref2: 'target'
                        }]
                    });
                assert.deepEqual(extended.getName('unkown'), []);
            });
            it('should return default for missing id', function () {
                var source = {
                        id: 'source'
                    },
                    target = {
                        id: 'target'
                    },
                    extended = extend({
                        elements: [source, target],
                        relations: [{
                            type: 'type.Relation',
                            ref1: 'source',
                            ref2: 'target'
                        }]
                    });
                assert.deepEqual(extended.getName('unkown', source.id), [source.id]);
                assert.deepEqual(extended.getName('unkown', [source.id]), [source.id]);
            });
        });
    });
    describe('custom', function () {
        var helper,
            extend;
        beforeEach(function () {
            helper = sinon.spy();
            extend = create({
                custom: {
                    name: helper
                }
            });
        });
        it('should attach the helper to the model', function () {
            var extended = extend({
                elements: [],
                relations: []
            });
            assert.equal(extended.name, helper);
        });
        it('should no invoke the helper during creation', function () {
            extend({
                elements: [],
                relations: []
            });
            assert.ok(!helper.called);
        });
    });
});
