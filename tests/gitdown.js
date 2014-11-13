var chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    nock = require('nock'),
    fs = require('fs');

chai.use(chaiAsPromised);
chai.use(sinonChai);

/**
 * @see http://stackoverflow.com/a/11477602/368691
 */
function requireNew (module) {
    var modulePath = require.resolve(module);
    
    delete require.cache[modulePath];

    return require(modulePath);
};

describe('Gitdown', function () {
    var Gitdown;
    beforeEach(function () {
        Gitdown = requireNew('../src/gitdown.js');
    });
    describe('._getGitPath()', function () {
        it('returns absolute path to the .git directory', function () {
            expect(Gitdown._getGitPath()).to.equal(fs.realpathSync(__dirname + '/../.git'));
        });
    });
    describe('._getRepositoryPath()', function () {
        it('returns absolute path to the parent of the _getGitPath() directory', function () {
            expect(Gitdown._getRepositoryPath()).to.equal(fs.realpathSync(Gitdown._getGitPath() + '/..'));
        });
    });
});

describe('gitdown', function () {
    var Gitdown;
    beforeEach(function () {
        Gitdown = requireNew('../src/gitdown.js');
    });
    describe('.get()', function () {
        it('returns the Gitdown instance input', function () {
            return expect(Gitdown('foo').get()).eventually.equal('foo');
        });
        it('interprets JSON <<{"github"}>>', function () {
            return expect(Gitdown('<<{"gitdown": "test"}>>').get()).eventually.equal('test');
        });
    });
    describe('.read()', function () {
        it('returns an instance of Gitdown', function () {
            return expect(Gitdown.read(__dirname + '/fixtures/foo.txt')).to.instanceof(Gitdown);
        });
        it('calls Gitdown using the contents of the file', function () {
            var gitdown = Gitdown.read(__dirname + '/fixtures/foo.txt');

            return expect(gitdown.get()).eventually.equal('bar');
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
});

describe('Gitdown.util.size', function () {
    var util;
    beforeEach(function () {
        util = requireNew('../src/gitdown.js').util.size;
    });
    describe('.file(filename)', function () {
        it('throws an error if file is not found', function () {
            return expect(util.file(__dirname + '/does-not-exist')).rejectedWith(Error, 'Input file does not exist.');
        });
        it('returns file size in bytes', function () {
            return expect(util.file(__dirname + '/fixtures/filesize.txt')).eventually.equal(191);
        });
    });
    describe('.file(filename, true)', function () {
        it('returns gziped file size in bytes', function () {
            return expect(util.file(__dirname + '/fixtures/filesize.txt', true)).eventually.equal(148);
        });
    });
    describe('.format(size)', function () {
        it('returns file size as human readable string', function () {
            expect(util.format(1000)).to.equal('1.00 kB');
        });
    });
});

/*
describe('Gitdown.util.link', function () {
    var Util,
        util;
    beforeEach(function () {
        Util = require('../src/gitdown.js').util.link,
        util = Util();
    });
    describe('.get(url)', function () {
        it('throws an error if HTTP status code is 404', function () {
            nock('http://gajus.com').get('/').reply(404);
            return expect(Util.get('http://gajus.com')).rejectedWith('Page not found.');
        });
        it('returns body if HTTP status code is 200', function () {
            nock('http://gajus.com').get('/').reply(200, 'OK');
            return expect(Util.get('http://gajus.com')).eventually.equal('OK');
        });
        // @todo File URL
        // @todo Redirect URL
    });
    describe('#deadURLs(url)', function () {
        nock('http://gajus.com').get('/found').reply(200);
        nock('http://gajus.com').get('/not-found-1').reply(404);
        nock('http://gajus.com').get('/not-found-2').reply(404);
        
        return expect(util.deadURLs(['http://gajus.com/found', 'http://gajus.com/not-found-1', 'http://gajus.com/not-found-2'])).eventually.equal(['http://gajus.com/not-found-1', 'http://gajus.com/not-found-2']);
    });
});*/