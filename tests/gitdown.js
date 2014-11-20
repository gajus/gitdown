var expect = require('chai').expect,
    fs = require('fs'),
    requireNew = require('require-new'),
    nock = require('nock'),
    sinon = require('sinon');

describe('Gitdown', function () {
    var Gitdown;
    beforeEach(function () {
        Gitdown = requireNew('../src/gitdown.js');
    });
    describe('.read()', function () {
        it('returns an instance of Gitdown', function () {
            return expect(Gitdown.read(__dirname + '/fixtures/foo.txt')).to.instanceof(Gitdown);
        });
        it('calls Gitdown using the contents of the file', function () {
            var gitdown = Gitdown.read(__dirname + '/fixtures/foo.txt');

            return gitdown
                .get()
                .then(function (response) {
                    expect(response).to.equal('bar');
                });
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
    });
    describe('.write()', function () {
        it('writes the output of .get() to a file', function () {
            var fileName = __dirname + '/fixtures/write.txt',
                randomString = Math.random() + '',
                gitdown = Gitdown(randomString);

            return gitdown
                .write(fileName)
                .then(function () {
                    expect(fs.readFileSync(fileName, {encoding: 'utf8'})).to.equal(randomString);
                });
        });
    });
    describe('.config()', function () {
        it('returns the current configuration', function () {
            var gitdown = Gitdown(''),
                config = gitdown.config(),
                expectedConfig = {};

            expectedConfig = {};
            expectedConfig.logger = {};
            expectedConfig.deadlink = {};
            expectedConfig.deadlink.findDeadURLs = true;
            expectedConfig.deadlink.findDeadFragmentIdentifiers = true;
            expectedConfig.gitinfo = {};
            expectedConfig.gitinfo.gitPath = __dirname;

            config.logger = expectedConfig.logger;

            expect(config).to.deep.equal(expectedConfig);
        });
        it('sets a configuration', function () {
            var gitdown = Gitdown(''),
                config = {};

            gitdown.config(config);

            expect(config).to.equal(gitdown.config());
        });
    });
    describe('._resolveURLs()', function () {
        var gitdown,
            config,
            logger,
            nocks;

        beforeEach(function () {
            gitdown = Gitdown('http://foo.com/ http://foo.com/#ok http://bar.com/ http://bar.com/#not-ok');
            config = gitdown.config();
            logger = gitdown.logger();

            /*{
                info: function () {},
                warn: function () {}
            }*/

            nocks = {};
            nocks.foo = nock('http://foo.com').get('/').reply(200, '<div id="ok"></div>', {'content-type': 'text/html'});
            nocks.bar = nock('http://bar.com').get('/').reply(404);
            

            //nocks.bar = nock('http://bar.com').get('/').reply(404);
            //nocks.baz = nock('http://baz.com').get('/').reply(200, '<div id="ok"></div>', {'content-type': 'text/html'});
            //nocks.qux = nock('http://qux.com').get('/').reply(200, 'OK', {'content-type': 'text/html'});
        });
        afterEach(function () {
            nock.cleanAll();
        });
        it('it does not resolve URLs when config.deadlink.findDeadURLs is false', function () {
            config.deadlink.findDeadURLs = false;
            config.deadlink.findDeadFragmentIdentifiers = false;

            gitdown.config(config);            

            return gitdown.get().then(function () {
                expect(nocks.foo.isDone()).to.be.false;
            });
        });
        it('it does resolve URLs when config.deadlink.findDeadURLs is true', function () {
            config.deadlink.findDeadURLs = true;
            config.deadlink.findDeadFragmentIdentifiers = false;

            gitdown.config(config);

            return gitdown.get().then(function () {
                expect(nocks.foo.isDone()).to.be.true;
            });
        });
        it('logs successful URL resolution using logger.info', function () {
            var spy = sinon.spy(logger, 'info');

            config.deadlink.findDeadURLs = true;
            config.deadlink.findDeadFragmentIdentifiers = true;

            gitdown.config(config);

            return gitdown.get().then(function () {
                expect(spy.calledWith('Resolved URL:', 'http://foo.com/')).to.be.true;
            });
        });
        it('logs successful URL and fragment identifier resolution using logger.info', function () {
            var spy = sinon.spy(logger, 'info');

            config.deadlink.findDeadURLs = true;
            config.deadlink.findDeadFragmentIdentifiers = true;

            gitdown.config(config);

            return gitdown.get().then(function () {
                expect(spy.calledWith('Resolved URL and the fragment identifier:', 'http://foo.com/#ok', 'ok')).to.be.true;
            });
        });
        it('logs unsuccessful URL resolution using logger.warn', function () {
            var spy = sinon.spy(logger, 'warn');

            config.deadlink.findDeadURLs = true;
            config.deadlink.findDeadFragmentIdentifiers = true;

            gitdown.config(config);

            return gitdown.get().then(function () {
                expect(spy.calledWith('Unresolved URL:', 'http://bar.com/')).to.be.true;
            });
        });
        it('logs unsuccessful fragment identifier resolution using logger.warn', function () {
            var spy = sinon.spy(logger, 'warn');

            config.deadlink.findDeadURLs = true;
            config.deadlink.findDeadFragmentIdentifiers = true;

            gitdown.config(config);

            return gitdown.get().then(function () {
                expect(spy.calledWith('Unresolved URL and/or the fragment identifier:', 'http://bar.com/#not-ok', 'not-ok')).to.be.true;
            });
        });
    });
});

