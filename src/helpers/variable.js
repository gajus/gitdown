var helper = {};

/**
 *
 */
helper.compile = function (config, context) {
    var scope = context.gitdown.config.variable.scope,
        value;

    config = config || {};
    
    if (!config.name) {
        throw new Error('config.name must be provided.');
    }

    value = helper._resolve(scope, config.name);

    if (value === false) {
        throw new Error('config.name "' + config.name + '" does not resolve to a defined value.');
    }

    return value;
};

/**
 *
 */
helper._resolve = function (obj, path) {
    var stone;

    path = path || '';

    if (path.indexOf('[') !== -1) {
        throw new Error('Unsupported object path notation.');
    }
    
    path = path.split('.');
    
    do {
        if (obj === undefined) {
            return false;
        }

        stone = path.shift();
        
        if (!obj.hasOwnProperty(stone)) {
            return false;
        }
        
        obj = obj[stone];
        
    } while (path.length);

    return obj;
};

/**
 *
 */
helper.weight = 10;

module.exports = helper