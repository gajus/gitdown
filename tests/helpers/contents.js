import {expect} from 'chai';
const importFresh = (moduleName) => import(`${moduleName}?${Date.now()}`);

describe('Parser.helpers.contents', () => {
  let helper;

  beforeEach(async () => {
    helper = (await importFresh('../../src/helpers/contents.js')).default;
  });
  describe('when heading nesting is disabled', () => {
    let context;

    beforeEach(() => {
      context = {
        gitdown: {
          getConfig: () => {
            return {
              headingNesting: {
                enabled: false,
              },
            };
          },
        },
        markdown: '',
      };
    });

    it('generates table of contents for a markdown document', () => {
      context.markdown = '\n# a\n## b\n##c ';

      const contents = helper.compile({}, context);

      expect(contents).to.equal('* [a](#a)\n    * [b](#b)\n    * [c](#c)\n');
    });
    it('generates table of contents with a maxLevel', () => {
      context.markdown = '\n# a\n## b\n###c';

      const contents = helper.compile({
        maxLevel: 2,
      }, context);

      expect(contents).to.equal('* [a](#a)\n    * [b](#b)\n');
    });
    it('generates unique IDs using incrementing index', () => {
      context.markdown = '\n# a\n## b\n## b';

      const contents = helper.compile({}, context);

      expect(contents).to.equal('* [a](#a)\n    * [b](#b)\n    * [b](#b-1)\n');
    });
  });
  describe('when heading nesting is enabled', () => {
    let context;

    beforeEach(() => {
      context = {
        gitdown: {
          getConfig: () => {
            return {
              headingNesting: {
                enabled: true,
              },
            };
          },
        },
        markdown: '',
      };
    });
    it('generates unique IDs using parent IDs', () => {
      context.markdown = '\n# a\n## b\n# c\n## d';

      const contents = helper.compile({}, context);

      expect(contents).to.equal('* [a](#a)\n    * [b](#a-b)\n* [c](#c)\n    * [d](#c-d)\n');
    });
  });
  describe('.maxLevel()', () => {
    it('removes nodes with level equal to maxLevel', () => {
      const tree = [
        {
          descendants: [
            {
              descendants: [
                {
                  descendants: [],
                  level: 3,
                },
              ],
              level: 2,
            },
          ],
          level: 1,
        },
      ];

      const treeAfterMaxDepth = [
        {
          descendants: [
            {
              descendants: [],
              level: 2,
            },
          ],
          level: 1,
        },
      ];

      expect(helper.maxLevel(tree, 2)).to.deep.equal(treeAfterMaxDepth);
    });
  });
  describe('.findRoot()', () => {
    it('find the object with ID', () => {
      const tree = [
        {
          descendants: [
            {
              descendants: [
                {
                  descendants: [],
                  id: 'baz',
                },
              ],
              id: 'bar',
            },
          ],
          id: 'foo',
        },
      ];

      expect(helper.findRoot(tree, 'bar')).to.equal(tree[0].descendants[0]);
    });
    it('throws an error if article with ID cannot be found', () => {
      expect(() => {
        helper.findRoot({}, 'bar');
      }).to.throw(Error, 'Heading does not exist with rootId ("bar").');
    });
  });
});
