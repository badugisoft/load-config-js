'use strict';

const assert = require('assert');
const path = require('path');
const loadConfig = require('../src');

describe('loadConfig', () => {
    describe('exceptions', () => {
        it('DIR_PARAM_MISSING', () => {
            assert.throws(() => {
                loadConfig();
            }, new Error('DIR_PARAM_MISSING'));
        });

        it('DIR_NOT_EXIST', () => {
            assert.throws(() => {
                loadConfig(path.join(__dirname, 'not_exist'));
            }, new Error('DIR_NOT_EXIST'));
        });

        it('INVALID_DIR', () => {
            assert.throws(() => {
                loadConfig(path.join(__dirname, 'test.js'));
            }, new Error('INVALID_DIR'));
        });

        it('NAMES_PARAM_MISSING', () => {
            assert.throws(() => {
                loadConfig(path.join(__dirname, 'config'));
            }, new Error('NAMES_PARAM_MISSING'));
        });
    });

    const dir = path.join(__dirname, 'config');

    describe('modules', () => {
        it('default', () => {
            const config = loadConfig(dir, 'default');

            assert.ok(config);
            assert.ok(config.__modules);

            assert.deepEqual(config.__modules, ['default']);
        });

        it('override', () => {
            const config = loadConfig(dir, 'default', 'override');

            assert.deepEqual(config.__modules, ['default', 'override']);
        });

        it('not_exist', () => {
            const config = loadConfig(dir, 'default', 'not_exist', 'override');

            assert.deepEqual(config.__modules, ['default', 'override']);
        });
    });

    describe('correctness', () => {
        it('basic', () => {
            const config = loadConfig(dir, 'default');

            assert.ok(config.rootVar);
            assert.equal(config.rootVar, 'root variable');

            assert.ok(config.rootVarOverride);
            assert.equal(config.rootVarOverride, 'root variable');
        });

        it('override', () => {
            const config = loadConfig(dir, 'default', 'override');

            assert.ok(config.overridden);
            assert.equal(config.overridden, true);

            assert.equal(config.rootVar, 'root variable');
            assert.equal(config.rootVarOverride, 'overridden variable');
        });
    });

    describe('flat', () => {
        it('default', () => {
            const config = loadConfig(dir, 'default');

            assert.ok(config.flat);
            assert.ok(config.flat.var);
            assert.equal(config.flat.var, 'flat variable');

            assert.ok(config.flat.varOverride);
            assert.equal(config.flat.varOverride, 'flat variable');
        });

        it('override', () => {
            const config = loadConfig(dir, 'default', 'override');

            assert.equal(config.flat.var, 'flat variable');
            assert.equal(config.flat.varOverride, 'overridden variable');
        });
    });
});