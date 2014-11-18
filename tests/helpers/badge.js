var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.badge', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/badge.js');
    });
    it('throws an error when config.name is not provided', function () {
        expect(function () {
            helper()
        }).to.throw(Error, 'config.name must be provided.');
    });
    it('throws an error if unknown config.name is provided', function () {
        expect(function () {
            helper({name: 'foo'})
        }).to.throw(Error, 'config.name "foo" is unknown service.');
    });
    describe('.service_npm_version()', function () {
        it('throws an error if package.json is not found in the root of the repository', function () {
            var context;

            context = {locator: {repositoryPath: function () { return __dirname; }}};

            expect(function () {
                helper({name: 'npm-version'}, context);
            }).to.throw(Error, './package.json is not found.');
        });
        it('returns markdown for the NPM badge', function () {
            var context,
                badge;

            context = {locator: {repositoryPath: function () { return __dirname + '/../fixtures/badge'; }}};
            badge = helper({name: 'npm-version'}, context);

            expect(badge).to.equal('[![NPM version](http://img.shields.io/npm/v/gitdown.svg?style=flat)](https://www.npmjs.org/package/gitdown)');
        });
    });
    describe('.service_bower_version()', function () {
        it('throws an error if bower.json is not found in the root of the repository', function () {
            var context;

            context = {locator: {repositoryPath: function () { return __dirname; }}};

            expect(function () {
                helper({name: 'bower-version'}, context);
            }).to.throw(Error, './bower.json is not found.');
        });
        it('returns markdown for the Bower badge', function () {
            var context,
                badge;

            context = {locator: {repositoryPath: function () { return __dirname + '/../fixtures/badge'; }}};

            badge = helper({name: 'bower-version'}, context);

            expect(badge).to.equal('[![Bower version](http://img.shields.io/bower/v/gitdown.svg?style=flat)](http://bower.io/search/?q=gitdown)');
        });
    });
    describe('.service_travis()', function () {
        xit('returns markdown for the NPM badge', function () {
            var context,
                badge;

            context = {
                locator: requireNew('../../src/locator.js')
            };

            badge = helper({name: 'travis'}, context);

            return badge
                .then(function (badgeMarkdown) {
                    expect(badgeMarkdown).to.equal('[![Travis build status](http://img.shields.io/travis/gajus/gitdown/master.svg?style=flat)](https://travis-ci.org/gajus/gitdown)');
                });
        });
    });
});