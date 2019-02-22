const fs = require('fs');
const path = require('path');
const extend = require('extend');
const unflatten = require('flat').unflatten;

function loadConfig(dir, ...names) {
    if (!dir) {
        throw new Error('DIR_PARAM_MISSING')
    };

    if (!fs.existsSync(dir)) {
        throw new Error('DIR_NOT_EXIST')
    }

    if (!fs.statSync(dir).isDirectory()) {
        throw new Error('INVALID_DIR')
    }

    if (names.length == 0) {
        throw new Error('NAMES_PARAM_MISSING')
    };

    return names.reduce(function (config, name) {
        try {
            const newConfig = extend(true, config, unflatten(require(path.join(dir, name))));
            newConfig.__modules.push(name);
            return newConfig;
        } catch (err) {
            if (err.code === 'MODULE_NOT_FOUND')
                return config;

            throw err;
        }
    }, {
        __modules: []
    });
}

module.exports = loadConfig;