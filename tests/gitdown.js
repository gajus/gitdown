'use strict';

var expect = require('chai').expect,
    fs = require('fs'),
    requireNew = require('require-new'),
    nock = require('nock'),
    sinon = require('sinon'),
    Path = require('path');

describe('Gitdown', function () {
    var Gitdown;
    beforeEach(function () {
        Gitdown = requireNew('../src/gitdown.js');
    });
    describe('.read()', function () {
        it('returns an instance of Gitdown', function () {
            return expect(Gitdown.read(Path.resolve(__dirname, './fixtures/foo.txt'))).to.instanceof(Gitdown);
        });
        it('calls Gitdown using the contents of the file', function () {
            var gitdown = Gitdown.read(Path.resolve(__dirname, './fixtures/foo.txt'));

            return gitdown
                .get()
                .then(function (response) {
                    expect(response).to.equal('bar');
                });
        });
    });
    describe('._nestHeadingIds()', function () {
        it('replaces heading markup with HTML', function () {
            expect(Gitdown._nestHeadingIds('# Foo\n# Bar')).to.equal('<h1 id="foo">Foo</h1>\n<h1 id="bar">Bar</h1>');
        });
        it('nests heading ids', function () {
            expect(Gitdown._nestHeadingIds('# Foo\n## Bar')).to.equal('<h1 id="foo">Foo</h1>\n<h2 id="foo-bar">Bar</h2>');
        });
    });
    describe('._nestHeadingIds.iterateTree()', function () {
        it('iterates through each leaf of tree', function () {
            var tree,
                result = [];

            tree = [
                {
                    id: 'a',
                    descendants: [
                        {id: 'b', descendants: []},
                        {id: 'c', descendants: []}
                    ]
                },
                {
                    id: 'd', descendants: []
                }
            ];

            Gitdown._nestHeadingIds.iterateTree(tree, function (index, leaf) {
                result.push(index + '-' + leaf.id);
            });

            expect(result).to.deep.equal(['1-a', '2-b', '3-c', '4-d']);
        });
    });
});

describe('gitdown', function () {
    var Gitdown;
    beforeEach(function () {
        Gitdown = requireNew('../src/gitdown.js');
    });
    describe('.get()', function () {
        it('is using Parser to produce the response', function () {
            return Gitdown('{"gitdown": "test"}')
                .get()
                .then(function (response) {
                    expect(response).to.equal('test');
                });
        });
        it('removes all gitdown specific HTML comments', function () {
            return Gitdown('a<!-- gitdown: on -->b<!-- gitdown: off -->c')
                .get()
                .then(function (response) {
                    expect(response).to.equal('abc');
                });
        });
    });
    describe('.write()', function () {
        it('writes the output of .get() to a file', function () {
            var fileName = Path.resolve(__dirname, './fixtures/write.txt'),
                randomString = Math.random() + '',
                gitdown = Gitdown(randomString);

            return gitdown
                .write(fileName)
                .then(function () {
                    expect(fs.readFileSync(fileName, {encoding: 'utf8'})).to.equal(randomString);
                });
        });
    });
    describe('.registerHelper()', function () {
        it('throws an error if registering a helper using name of an existing helper', function () {
            var gitdown = Gitdown('');
            expect(function () {
                gitdown.registerHelper('test');
            }).to.throw(Error, 'There is already a helper with a name "test".');
        });
        it('throws an error if registering a helper object without compile property', function () {
            var gitdown = Gitdown('');
            expect(function () {
                gitdown.registerHelper('new-helper');
            }).to.throw(Error, 'Helper object must defined "compile" property.');
        });
        it('registers a new helper', function () {
            var gitdown = Gitdown('{"gitdown": "new-helper", "testProp": "foo"}');
            gitdown.registerHelper('new-helper', {
                compile: function (config) {
                    return 'Test prop: ' + config.testProp;
                }
            });
            return gitdown
                .get()
                .then(function (markdown) {
                    expect(markdown).to.equal('Test prop: foo');
                });
        });
    });
    describe('.config', function () {
        var defaultConfiguration;
        beforeEach(function () {
            defaultConfiguration = {
                headingNesting: {
                    enabled: true
                },
                variable: {
                    scope: {}
                },
                deadlink: {
                    findDeadURLs: false,
                    findDeadFragmentIdentifiers: false
                },
                gitinfo: {
                    gitPath: __dirname
                }
            };
        });
        it('returns the current configuration', function () {
            var gitdown = Gitdown(''),
                config = gitdown.config;

            expect(config).to.deep.equal(defaultConfiguration);
        });
        it('sets a configuration', function () {
            var gitdown = Gitdown('');

            gitdown.config = defaultConfiguration;

            expect(defaultConfiguration).to.equal(gitdown.config);
        });
    });
    describe('._resolveURLs()', function () {
        var gitdown,
            config,
            logger,
            nocks;

        beforeEach(function () {
            gitdown = Gitdown('http://foo.com/ http://foo.com/#ok http://bar.com/ http://bar.com/#not-ok');
            config = gitdown.config;

            gitdown.logger = {
                info: function () {},
                warn: function () {}
            };

            logger = gitdown.logger;

            nocks = {};
            nocks.foo = nock('http://foo.com').get('/').reply(200, '<div id="ok"></div>', {'content-type': 'text/html'});
            nocks.bar = nock('http://bar.com').get('/').reply(404);
        });

        afterEach(function () {
            nock.cleanAll();
        });

        it('it does not resolve URLs when config.deadlink.findDeadURLs is false', function () {
            config.deadlink.findDeadURLs = false;
            config.deadlink.findDeadFragmentIdentifiers = false;

            gitdown.config = config;

            return gitdown.get()
                .then(function () {
                    expect(nocks.foo.isDone()).to.equal(false);
                });
        });
        it('it does resolve URLs when config.deadlink.findDeadURLs is true', function () {
            config.deadlink.findDeadURLs = true;
            config.deadlink.findDeadFragmentIdentifiers = false;

            gitdown.config = config;

            return gitdown.get()
                .then(function () {
                    expect(nocks.foo.isDone()).to.equal(true);
                });
        });
        it('logs successful URL resolution using logger.info', function () {
            var spy = sinon.spy(logger, 'info');

            console.log('spy.callCount', spy.callCount);

            config.deadlink.findDeadURLs = true;
            config.deadlink.findDeadFragmentIdentifiers = false;

            gitdown.config = config;

            return gitdown.get()
                .then(function () {
                    console.log('spy.callCount', spy.callCount);
                    console.log('spy.getCall(0)', spy.getCall(0).args);
                    expect(spy.calledWith('Resolved URL:', 'http://foo.com/')).to.equal(true);
                });
        });
        it('logs successful URL and fragment identifier resolution using logger.info', function () {
            var spy = sinon.spy(logger, 'info');

            config.deadlink.findDeadURLs = true;
            config.deadlink.findDeadFragmentIdentifiers = true;

            gitdown.config = config;

            return gitdown.get()
                .then(function () {
                    expect(spy.calledWith('Resolved fragment identifier:', 'http://foo.com/#ok')).to.equal(true);
                });
        });
        it('logs unsuccessful URL resolution using logger.warn', function () {
            var spy = sinon.spy(logger, 'warn');

            config.deadlink.findDeadURLs = true;
            config.deadlink.findDeadFragmentIdentifiers = true;

            gitdown.config = config;

            return gitdown.get()
                .then(function () {
                    expect(spy.calledWith('Unresolved URL:', 'http://bar.com/')).to.equal(true);
                });
        });
        it('logs unsuccessful fragment identifier resolution using logger.warn', function () {
            var spy = sinon.spy(logger, 'warn');

            config.deadlink.findDeadURLs = true;
            config.deadlink.findDeadFragmentIdentifiers = true;

            gitdown.config = config;

            return gitdown.get()
                .then(function () {
                    expect(spy.calledWith('Unresolved fragment identifier:', 'http://bar.com/#not-ok')).to.equal(true);
                });
        });
    });
});
