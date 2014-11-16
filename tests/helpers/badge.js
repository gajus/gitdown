var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.badge', function () {
    var helper,
        Locator;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/badge.js');
        Locator = requireNew('../../src/locator.js');
    });
    it('throws an error when config.name is not provided', function () {
        expect(function () {
            helper()
        }).to.throw(Error, 'Badge config.name must be provided.');
    });
    it('throws an error if unknown config.name is provided', function () {
        expect(function () {
            helper('', {name: 'foo'})
        }).to.throw(Error, 'Badge config.name "foo" is unknown service.');
    });
    describe('.service_npm_version()', function () {
        it('throws an error if package.json is not found in the root of the repository', function () {
            expect(function () {
                helper('', {name: 'npm-version'}, {repositoryPath: function () { return __dirname; }})
            }).to.throw(Error, './package.json is not found.');
        });
        it('returns markdown for the NPM badge', function () {
            var badge = helper('', {name: 'npm-version'}, {repositoryPath: function () { return __dirname + '/../fixtures/badge'; }});

            expect(badge).to.equal('[![NPM version](http://img.shields.io/npm/v/gitdown.svg?style=flat)](https://www.npmjs.org/package/gitdown)');
        });
    });
    describe('.service_travis()', function () {
        it('returns markdown for the NPM badge', function () {
            var badge = helper('', {name: 'travis'}, Locator);

            return badge
                .then(function (badgeMarkdown) {
                    expect(badgeMarkdown).to.equal('[![Travis build status](http://img.shields.io/travis/gajus/gitdown/master.svg?style=flat)](https://travis-ci.org/gajus/gitdown)');
                });
        });
    });
});