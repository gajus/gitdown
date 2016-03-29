/* eslint-disable import/no-commonjs */

const expect = require('chai').expect;
const requireNew = require('require-new');
const Path = require('path');

describe('Parser.helpers.badge', () => {
    let gitinfoContext,
        helper;

    beforeEach(() => {
        helper = requireNew('../../src/helpers/badge.js');
        gitinfoContext = {
            parser: {
                helpers: () => {
                    return {
                        gitinfo: {
                            compile (config) {
                                if (config.name === 'username') {
                                    return 'a';
                                } else if (config.name === 'name') {
                                    return 'b';
                                } else if (config.name === 'branch') {
                                    return 'c';
                                }

                                throw new Error('Invalid config.');
                            }
                        }
                    };
                }
            }
        };
    });
    it('throws an error when config.name is not provided', () => {
        expect(() => {
            helper.compile();
        }).to.throw(Error, 'config.name must be provided.');
    });
    it('throws an error if unknown config.name is provided', () => {
        expect(() => {
            helper.compile({name: 'foo'});
        }).to.throw(Error, 'config.name "foo" is unknown service.');
    });
    describe('services', () => {
        describe('npm-version', () => {
            it('throws an error if package.json is not found in the root of the repository', () => {
                const context = {
                    locator: {
                        repositoryPath: () => {
                            return __dirname;
                        }
                    }
                };

                expect(() => {
                    helper.compile({name: 'npm-version'}, context);
                }).to.throw(Error, './package.json is not found.');
            });
            it('returns markdown for the NPM badge', () => {
                const context = {
                    locator: {
                        repositoryPath: () => {
                            return Path.resolve(__dirname, './../fixtures/badge');
                        }
                    }
                };

                const badge = helper.compile({name: 'npm-version'}, context);

                expect(badge).to.equal('[![NPM version](http://img.shields.io/npm/v/gitdown.svg?style=flat-square)](https://www.npmjs.org/package/gitdown)');
            });
        });
        describe('bower-version', () => {
            it('throws an error if bower.json is not found in the root of the repository', () => {
                const context = {
                    locator: {
                        repositoryPath: () => {
                            return __dirname;
                        }
                    }
                };

                expect(() => {
                    helper.compile({name: 'bower-version'}, context);
                }).to.throw(Error, './bower.json is not found.');
            });
            it('returns markdown for the Bower badge', () => {
                const context = {
                    locator: {
                        repositoryPath: () => {
                            return Path.resolve(__dirname, './../fixtures/badge');
                        }
                    }
                };

                const badge = helper.compile({name: 'bower-version'}, context);

                expect(badge).to.equal('[![Bower version](http://img.shields.io/bower/v/gitdown.svg?style=flat-square)](http://bower.io/search/?q=gitdown)');
            });
        });
        describe('coveralls', () => {
            it('returns markdown for the coveralls badge', () => {
                const badge = helper.compile({name: 'coveralls'}, gitinfoContext);

                expect(badge).to.equal('[![Coverage Status](https://img.shields.io/coveralls/a/b/c.svg?style=flat-square)](https://coveralls.io/r/a/b?branch=c)');
            });
        });
        describe('gitter', () => {
            it('returns markdown for the gitter badge', () => {
                const badge = helper.compile({name: 'gitter'}, gitinfoContext);

                expect(badge).to.equal('[![Gitter chat](https://img.shields.io/gitter/room/a/b.svg?style=flat-square)](https://gitter.im/a/b)');
            });
        });
        describe('david', () => {
            it('returns markdown for the david badge', () => {
                const badge = helper.compile({name: 'david'}, gitinfoContext);

                expect(badge).to.equal('[![Dependency Status](https://img.shields.io/david/a/b.svg?style=flat-square)](https://david-dm.org/a/b)');
            });
        });
        describe('david-dev', () => {
            it('returns markdown for the david badge', () => {
                const badge = helper.compile({name: 'david-dev'}, gitinfoContext);

                expect(badge).to.equal('[![Development Dependency Status](https://img.shields.io/david/dev/a/b.svg?style=flat-square)](https://david-dm.org/a/b#info=devDependencies)');
            });
        });
        describe('travis', () => {
            it('returns markdown for the travis badge', () => {
                const badge = helper.compile({name: 'travis'}, gitinfoContext);

                expect(badge).to.equal('[![Travis build status](http://img.shields.io/travis/a/b/c.svg?style=flat-square)](https://travis-ci.org/a/b)');
            });
        });
        describe('waffle', () => {
            it('returns markdown for the waffle badge', () => {
                const badge = helper.compile({name: 'waffle'}, gitinfoContext);

                expect(badge).to.equal('[![Stories in Ready](https://badge.waffle.io/a/b.svg?label=ready&title=Ready)](https://waffle.io/a/b)');
            });
        });

        describe('codeclimate', () => {
            it('returns markdown for the codeclimate gpa badge', () => {
                const badge = helper.compile({name: 'codeclimate-gpa'}, gitinfoContext);

                expect(badge).to.equal('[![Code Climate GPA](https://img.shields.io/codeclimate/github/github/a/b.svg?style=flat-square)](https://codeclimate.com/github/a/b)');
            });
            it('returns markdown for the codeclimate coverage badge', () => {
                const badge = helper.compile({name: 'codeclimate-coverage'}, gitinfoContext);

                expect(badge).to.equal('[![Code Climate Coverage](https://img.shields.io/codeclimate/coverage/github/github/a/b.svg?style=flat-square)](https://codeclimate.com/github/a/b)');
            });
        });

        describe('appveyor', () => {
            it('returns markdown for the AppVeyor badge', () => {
                const badge = helper.compile({name: 'appveyor'}, gitinfoContext);

                expect(badge).to.equal('[![AppVeyor build status](https://img.shields.io/appveyor/ci/a/b/c.svg?style=flat-square)](https://ci.appveyor.com/project/a/b/branch/c)');
            });
        });
    });
});
