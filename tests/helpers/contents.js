var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.contents', function () {
    var helper;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/contents.js');
    });
    it('generates table of contents for a markdown document', function () {
        var contents = helper({}, {markdown: '\n# a\n## b\n##c '});

        expect(contents).to.equal('* [a](#a)\n    * [b](#a-b)\n    * [c](#a-c)\n');
    });
    it('generates table of contents with a maxLevel', function () {
        var contents = helper({maxLevel: 2}, {markdown: '\n# a\n## b\n###c'});

        expect(contents).to.equal('* [a](#a)\n    * [b](#a-b)\n');
    })
    describe('.maxLevel()', function () {
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

            expect(helper.maxLevel(tree, 2)).to.deep.equal(treeAfterMaxDepth);
        });
    });
    describe('.findRoot()', function () {
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

            expect(helper.findRoot(tree, 'bar')).to.equal(tree[0].descendants[0]);
        });
        it('throws an error if article with ID cannot be found', function () {
            expect(function () {
                helper.findRoot({}, 'bar');
            }).to.throw(Error, 'Heading does not exist with rootId ("bar").');
        });
    });
});