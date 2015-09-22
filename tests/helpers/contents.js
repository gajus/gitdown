'use strict';

var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.contents', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/contents.js');
    });
    describe('when heading nesting is disabled', function () {
        var context;
        beforeEach(function () {
            context = {
                markdown: '',
                gitdown: {
                    getConfig: function () {
                        return {
                            headingNesting: {
                                enabled: false
                            }
                        };
                    }
                }
            };
        });

        it('generates table of contents for a markdown document', function () {
            var contents;

            context.markdown = '\n# a\n## b\n##c ';

            contents = helper.compile({}, context);

            expect(contents).to.equal('* [a](#a)\n    * [b](#b)\n    * [c](#c)\n');
        });
        it('generates table of contents with a maxLevel', function () {
            var contents;

            context.markdown = '\n# a\n## b\n###c';

            contents = helper.compile({maxLevel: 2}, context);

            expect(contents).to.equal('* [a](#a)\n    * [b](#b)\n');
        });
        it('generates unique IDs using incrementing index', function () {
            var contents;

            context.markdown = '\n# a\n## b\n## b';

            contents = helper.compile({}, context);

            expect(contents).to.equal('* [a](#a)\n    * [b](#b)\n    * [b](#b-1)\n');
        });
    });
    describe('when heading nesting is enabled', function () {
        var context;
        beforeEach(function () {
            context = {
                markdown: '',
                gitdown: {
                    getConfig: function () {
                        return {
                            headingNesting: {
                                enabled: true
                            }
                        };
                    }
                }
            };
        });
        it('generates unique IDs using parent IDs', function () {
            var contents;

            context.markdown = '\n# a\n## b\n# c\n## b';

            contents = helper.compile({}, context);

            expect(contents).to.equal('* [a](#a)\n    * [b](#a-b)\n* [c](#c)\n    * [b](#c-b)\n');
        });
        /* describe('when unique ID pool is exhausted', function () {
            it('generates unique IDs using parent IDs plus an incremental ID', function () {
                var contents;
                context.markdown = '\n# a\n## b\n## b';
                contents = helper.compile({}, context);
                expect(contents).to.equal('* [a](#a)\n    * [b](#a-b)\n    * [b](#a-b-1)\n');
            });
        }); */
    });
    describe('._maxLevel()', function () {
        it('removes nodes with level equal to maxLevel', function () {
            var tree,
                treeAfterMaxDepth;

            tree = [{
                level: 1,
                descendants: [
                    {
                        level: 2,
                        descendants: [
                            {
                                level: 3,
                                descendants: []
                            }
                        ]
                    }
                ]
            }];

            treeAfterMaxDepth = [{
                level: 1,
                descendants: [
                    {
                        level: 2,
                        descendants: []
                    }
                ]
            }];

            expect(helper._maxLevel(tree, 2)).to.deep.equal(treeAfterMaxDepth);
        });
    });
    describe('._findRoot()', function () {
        it('find the object with ID', function () {
            var tree;

            tree = [
                {
                    id: 'foo',
                    descendants: [
                        {
                            id: 'bar',
                            descendants: [
                                {
                                    id: 'baz',
                                    descendants: []
                                }
                            ]
                        }
                    ]
                }
            ];

            expect(helper._findRoot(tree, 'bar')).to.equal(tree[0].descendants[0]);
        });
        it('throws an error if article with ID cannot be found', function () {
            expect(function () {
                helper._findRoot({}, 'bar');
            }).to.throw(Error, 'Heading does not exist with rootId ("bar").');
        });
    });
});
