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

describe('factory', function () {
    it('should be a function', function () {
        assert.equal(typeof create, 'function');
    });
    it('should throw with no arguments', function () {
        assert.throws(function () { create(); });
    });
    it('should throw with invalid configuration', function () {
        assert.throws(function () { create(undefined); });
        assert.throws(function () { create(null); });
        assert.throws(function () { create(0); });
        assert.throws(function () { create(1); });
        assert.throws(function () { create(false); });
        assert.throws(function () { create(true); });
        assert.throws(function () { create(''); });
        assert.throws(function () { create('value'); });
        assert.throws(function () { create(/ /); });
        assert.throws(function () { create(sinon.spy()); });
    });
    describe('type', function () {
        it('should throw with invalid field', function () {
            function text(configuration) {
                create({
                    type: configuration
                });
            }
            assert.throws(function () { text(undefined); });
            assert.throws(function () { text(null); });
            assert.throws(function () { text(0); });
            assert.throws(function () { text(1); });
            assert.throws(function () { text(false); });
            assert.throws(function () { text(true); });
            assert.throws(function () { text(''); });
            assert.throws(function () { text('value'); });
            assert.throws(function () { text(/ /); });
            assert.throws(function () { text(sinon.spy()); });
        });
        it('should throw with invalid configuration', function () {
            function text(configuration) {
                create({
                    type: {
                        name: configuration
                    }
                });
            }
            assert.throws(function () { text(undefined); });
            assert.throws(function () { text(null); });
            assert.throws(function () { text(0); });
            assert.throws(function () { text(1); });
            assert.throws(function () { text(false); });
            assert.throws(function () { text(true); });
            assert.throws(function () { text(/ /); });
            assert.throws(function () { text(sinon.spy()); });
            assert.throws(function () { text({}); });
        });
    });
    describe('relation', function () {
        it('should throw with invalid field', function () {
            function text(configuration) {
                create({
                    relation: configuration
                });
            }
            assert.throws(function () { text(undefined); });
            assert.throws(function () { text(null); });
            assert.throws(function () { text(0); });
            assert.throws(function () { text(1); });
            assert.throws(function () { text(false); });
            assert.throws(function () { text(true); });
            assert.throws(function () { text(''); });
            assert.throws(function () { text('value'); });
            assert.throws(function () { text(/ /); });
            assert.throws(function () { text(sinon.spy()); });
        });
        it('should throw with invalid configuration', function () {
            function text(configuration) {
                create({
                    relation: {
                        name: configuration
                    }
                });
            }
            assert.throws(function () { text(undefined); });
            assert.throws(function () { text(null); });
            assert.throws(function () { text(0); });
            assert.throws(function () { text(1); });
            assert.throws(function () { text(false); });
            assert.throws(function () { text(true); });
            assert.throws(function () { text({}); });
            assert.throws(function () { text(/ /); });
            assert.throws(function () { text(sinon.spy()); });
        });
        it('should throw with missing missing relation field', function () {
            var options = {
                relation: {
                    name: {
                        from: 'from',
                        to: 'to'
                    }
                }
            };
            assert.throws(function () { create(options); });
        });
        it('should throw with invalid configuration relation', function () {
            function text(relation) {
                create({
                    relation: {
                        name: {
                            relation: relation,
                            from: 'from',
                            to: 'to'
                        }
                    }
                });
            }
            assert.throws(function () { text(undefined); });
            assert.throws(function () { text(null); });
            assert.throws(function () { text(0); });
            assert.throws(function () { text(1); });
            assert.throws(function () { text(false); });
            assert.throws(function () { text(true); });
            assert.throws(function () { text({}); });
            assert.throws(function () { text(/ /); });
            assert.throws(function () { text(sinon.spy()); });
        });
        it('should throw with missing missing from field', function () {
            var options = {
                relation: {
                    name: {
                        relation: 'relation',
                        to: 'to'
                    }
                }
            };
            assert.throws(function () { create(options); });
        });
        it('should throw with invalid configuration from', function () {
            function text(from) {
                create({
                    relation: {
                        name: {
                            relation: 'relation',
                            from: from,
                            to: 'to'
                        }
                    }
                });
            }
            assert.throws(function () { text(undefined); });
            assert.throws(function () { text(null); });
            assert.throws(function () { text(0); });
            assert.throws(function () { text(1); });
            assert.throws(function () { text(false); });
            assert.throws(function () { text(true); });
            assert.throws(function () { text({}); });
            assert.throws(function () { text(/ /); });
            assert.throws(function () { text(sinon.spy()); });
        });
        it('should throw with missing missing to field', function () {
            var options = {
                relation: {
                    name: {
                        relation: 'relation',
                        from: 'from'
                    }
                }
            };
            assert.throws(function () { create(options); });
        });
        it('should throw with invalid configuration to', function () {
            function text(to) {
                create({
                    relation: {
                        name: {
                            relation: 'relation',
                            from: 'from',
                            to: to
                        }
                    }
                });
            }
            assert.throws(function () { text(undefined); });
            assert.throws(function () { text(null); });
            assert.throws(function () { text(0); });
            assert.throws(function () { text(1); });
            assert.throws(function () { text(false); });
            assert.throws(function () { text(true); });
            assert.throws(function () { text({}); });
            assert.throws(function () { text(/ /); });
            assert.throws(function () { text(sinon.spy()); });
        });
    });
    describe('custom', function () {
        it('should throw with invalid field', function () {
            function text(configuration) {
                create({
                    custom: configuration
                });
            }
            assert.throws(function () { text(undefined); });
            assert.throws(function () { text(null); });
            assert.throws(function () { text(0); });
            assert.throws(function () { text(1); });
            assert.throws(function () { text(false); });
            assert.throws(function () { text(true); });
            assert.throws(function () { text(''); });
            assert.throws(function () { text('value'); });
            assert.throws(function () { text(/ /); });
            assert.throws(function () { text(sinon.spy()); });
        });
        it('should throw with invalid helper', function () {
            function text(helper) {
                create({
                    custom: {
                        name: helper
                    }
                });
            }
            assert.throws(function () { text(undefined); });
            assert.throws(function () { text(null); });
            assert.throws(function () { text(0); });
            assert.throws(function () { text(1); });
            assert.throws(function () { text(false); });
            assert.throws(function () { text(true); });
            assert.throws(function () { text(''); });
            assert.throws(function () { text('value'); });
            assert.throws(function () { text(/ /); });
            assert.throws(function () { text({}); });
        });
    });
    it('should return a function', function () {
        var extend = create({});
        assert.equal(typeof extend, 'function');
    });
});
