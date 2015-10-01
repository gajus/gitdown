'use strict';

var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.include', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('./../../src/helpers/include.js');
    });
    it('is rejected with an error when config.file is not provided', function () {
        expect(function () {
            helper.compile();
        }).to.throw(Error, 'config.file must be provided.');
    });
    it('is rejected with an error when file is not found', function () {
        var context;

        context = {
            gitdown: {
                getConfig: function () {
                    return {
                        baseDirectory: __dirname
                    };
                }
            }
        };

        expect(function () {
            helper.compile({file: __dirname + '/does-not-exist'}, context);
        }).to.throw(Error, 'Input file does not exist.');
    });
});
