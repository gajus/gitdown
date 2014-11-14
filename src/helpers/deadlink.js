var util = {},
    Deadlink = require('deadlink'),
    deadlink = Deadlink();

util = function () {
    var _util = {},
        getIndex = {};

    /**
     * Get URL and cache the reference to the promise.
     */
    _util.get = function (url) {
        if (getIndex[url] !== undefined) {
            return getIndex[url];
        }

        getIndex[url] = util.get(url);

        return getIndex[url];
    }

    _util.deadURLs = function (urls) {
        

        util.get(url);
    };

    return _util;
};

module.exports = util;