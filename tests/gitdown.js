/* eslint-disable import/no-commonjs, max-nested-callbacks */

const _ = require('lodash');
const expect = require('chai').expect;
const fs = require('fs');
const requireNew = require('require-new');
const nock = require('nock');
const sinon = require('sinon');
const path = require('path');

describe('Gitdown', () => {
    let Gitdown;

    beforeEach(() => {
        Gitdown = requireNew('../src/');
    });
    describe('.readFile()', () => {
        it('calls Gitdown.read() using the contents of the file', () => {
            const gitdown = Gitdown.readFile(path.resolve(__dirname, './fixtures/foo.txt'));

            gitdown.setConfig({
                gitinfo: {
                    gitPath: path.resolve(__dirname, './dummy_git/')
                }
            });

            return gitdown
                .get()
                .then((response) => {
                    expect(response).to.equal('bar');
                });
        });
    });
    describe('.nestHeadingIds()', () => {
        it('replaces heading markup with HTML', () => {
            expect(Gitdown.nestHeadingIds('# Foo\n# Bar')).to.equal('<h1 id="foo">Foo</h1>\n<h1 id="bar">Bar</h1>');
        });
        it('nests heading ids', () => {
            expect(Gitdown.nestHeadingIds('# Foo\n## Bar')).to.equal('<h1 id="foo">Foo</h1>\n<h2 id="foo-bar">Bar</h2>');
        });
    });
    describe('.nestHeadingIds.iterateTree()', () => {
        it('iterates through each leaf of tree', () => {
            const result = [];

            const tree = [
                {
                    descendants: [
                        {
                            descendants: [],
                            id: 'b'
                        },
                        {
                            descendants: [],
                            id: 'c'
                        }
                    ],
                    id: 'a'
                },
                {
                    descendants: [],
                    id: 'd'
                }
            ];

            Gitdown.nestHeadingIds.iterateTree(tree, (index, leaf) => {
                result.push(index + '-' + leaf.id);
            });

            expect(result).to.deep.equal([
                '1-a',
                '2-b',
                '3-c',
                '4-d'
            ]);
        });
    });
});

describe('Gitdown.read()', () => {
    let Gitdown;

    beforeEach(() => {
        Gitdown = requireNew('../src/');
    });
    describe('.get()', () => {
        it('is using Parser to produce the response', () => {
            const gitdown = Gitdown.read('{"gitdown": "test"}');

            gitdown.setConfig({
                gitinfo: {
                    gitPath: path.resolve(__dirname, './dummy_git/')
                }
            });

            return gitdown
                .get()
                .then((response) => {
                    expect(response).to.equal('test');
                });
        });
        it('removes all gitdown specific HTML comments', () => {
            const gitdown = Gitdown.read('a<!-- gitdown: on -->b<!-- gitdown: off -->c');

            gitdown.setConfig({
                gitinfo: {
                    gitPath: path.resolve(__dirname, './dummy_git/')
                }
            });

            return gitdown
                .get()
                .then((response) => {
                    expect(response).to.equal('abc');
                });
        });
    });
    describe('.writeFile()', () => {
        it('writes the output of .get() to a file', () => {
            const fileName = path.resolve(__dirname, './fixtures/write.txt');
            const randomString = String(Math.random());
            const gitdown = Gitdown.read(randomString);

            gitdown.setConfig({
                gitinfo: {
                    gitPath: path.resolve(__dirname, './dummy_git/')
                }
            });

            return gitdown
                .writeFile(fileName)
                .then(() => {
                    expect(fs.readFileSync(fileName, {encoding: 'utf8'})).to.equal(randomString);
                });
        });
    });
    describe('.registerHelper()', () => {
        it('throws an error if registering a helper using name of an existing helper', () => {
            const gitdown = Gitdown.read('');

            expect(() => {
                gitdown.registerHelper('test');
            }).to.throw(Error, 'There is already a helper with a name "test".');
        });
        it('throws an error if registering a helper object without compile property', () => {
            const gitdown = Gitdown.read('');

            expect(() => {
                gitdown.registerHelper('new-helper');
            }).to.throw(Error, 'Helper object must defined "compile" property.');
        });
        it('registers a new helper', () => {
            const gitdown = Gitdown.read('{"gitdown": "new-helper", "testProp": "foo"}');

            gitdown.setConfig({
                gitinfo: {
                    gitPath: path.resolve(__dirname, './dummy_git/')
                }
            });
            gitdown.registerHelper('new-helper', {
                compile (config) {
                    return 'Test prop: ' + config.testProp;
                }
            });

            return gitdown
                .get()
                .then((markdown) => {
                    expect(markdown).to.equal('Test prop: foo');
                });
        });
    });
    xdescribe('.setConfig()', () => {
        let defaultConfiguration;

        beforeEach(() => {
            defaultConfiguration = {
                deadlink: {
                    findDeadFragmentIdentifiers: false,
                    findDeadURLs: false
                },
                gitinfo: {
                    gitPath: __dirname
                },
                headingNesting: {
                    enabled: true
                },
                variable: {
                    scope: {}
                }
            };
        });
        it('returns the current configuration', () => {
            const gitdown = Gitdown.read('');
            const config = gitdown.config;

            expect(config).to.deep.equal(defaultConfiguration);
        });
        it('sets a configuration', () => {
            const gitdown = Gitdown.read('');

            gitdown.config = defaultConfiguration;

            expect(defaultConfiguration).to.equal(gitdown.config);
        });
    });
    describe('.resolveURLs()', () => {
        let gitdown,
            logger,
            nocks;

        beforeEach(() => {
            gitdown = Gitdown.read('http://foo.com/ http://foo.com/#ok http://bar.com/ http://bar.com/#not-ok');

            gitdown.setConfig({
                gitinfo: {
                    gitPath: path.resolve(__dirname, './dummy_git/')
                }
            });

            logger = {
                info () {},
                warn () {}
            };

            gitdown.setLogger(logger);

            logger = gitdown.getLogger();

            nocks = {};
            nocks.foo = nock('http://foo.com').get('/').reply(200, '<div id="ok"></div>', {'content-type': 'text/html'});
            nocks.bar = nock('http://bar.com').get('/').reply(404);
        });

        afterEach(() => {
            nock.cleanAll();
        });

        it('it does not resolve URLs when config.deadlink.findDeadURLs is false', () => {
            gitdown.setConfig({
                deadlink: {
                    findDeadFragmentIdentifiers: false,
                    findDeadURLs: false
                }
            });

            return gitdown
                .get()
                .then(() => {
                    expect(nocks.foo.isDone()).to.equal(false);
                });
        });
        it('it does resolve URLs when config.deadlink.findDeadURLs is true', () => {
            gitdown.setConfig({
                deadlink: {
                    findDeadFragmentIdentifiers: false,
                    findDeadURLs: true
                }
            });

            return gitdown
                .get()
                .then(() => {
                    expect(nocks.foo.isDone()).to.equal(true);
                });
        });
        it('logs successful URL resolution using logger.info', () => {
            const spy = sinon.spy(logger, 'info');

            // console.log('spy.callCount', spy.callCount);

            gitdown.setConfig({
                deadlink: {
                    findDeadFragmentIdentifiers: false,
                    findDeadURLs: true
                }
            });

            return gitdown
                .get()
                .then(() => {
                    // console.log('spy.callCount', spy.callCount);
                    // console.log('spy.getCall(0)', spy.getCall(0).args);

                    expect(spy.calledWith('Resolved URL:', 'http://foo.com/')).to.equal(true);
                });
        });
        it('logs successful URL and fragment identifier resolution using logger.info', () => {
            const spy = sinon.spy(logger, 'info');

            gitdown.setConfig({
                deadlink: {
                    findDeadFragmentIdentifiers: true,
                    findDeadURLs: true
                }
            });

            return gitdown
                .get()
                .then(() => {
                    expect(spy.calledWith('Resolved fragment identifier:', 'http://foo.com/#ok')).to.equal(true);
                });
        });
        it('logs unsuccessful URL resolution using logger.warn', () => {
            const spy = sinon.spy(logger, 'warn');

            gitdown.setConfig({
                deadlink: {
                    findDeadFragmentIdentifiers: true,
                    findDeadURLs: true
                }
            });

            return gitdown
                .get()
                .then(() => {
                    expect(spy.calledWith('Unresolved URL:', 'http://bar.com/')).to.equal(true);
                });
        });
        it('logs unsuccessful fragment identifier resolution using logger.warn', () => {
            const spy = sinon.spy(logger, 'warn');

            gitdown.setConfig({
                deadlink: {
                    findDeadFragmentIdentifiers: true,
                    findDeadURLs: true
                }
            });

            return gitdown
                .get()
                .then(() => {
                    expect(spy.calledWith('Unresolved fragment identifier:', 'http://bar.com/#not-ok')).to.equal(true);
                });
        });
    });
});
