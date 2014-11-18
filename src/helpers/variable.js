var helper;

helper = function (config, context) {
    var variables = context.gitdown.config().variables,
        value;

    config = config || {};
    
    if (!config.name) {
        throw new Error('config.name must be provided.');
    }

    value = helper.resolve(variables, config.name);

    if (value === false) {
        throw new Error('config.name "' + config.name + '" does not resolve to a defined value.');
    }

    return value;
};

helper.resolve = function (obj, path) {
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
helper.weight = function () {
    return 10;
};

module.exports = helper