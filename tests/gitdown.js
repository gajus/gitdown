import {
  expect,
} from 'chai';
import fs from 'fs';
import nock from 'nock';
import path from 'path';
import {
  spy,
} from 'sinon';
import {
  fileURLToPath,
} from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const importFresh = (moduleName) => {
  return import(`${moduleName}?${Date.now()}`);
};

describe('Gitdown', () => {
  let Gitdown;

  beforeEach(async () => {
    Gitdown = (await importFresh('../src/index.js')).default;
  });
  describe('.readFile()', () => {
    it('calls Gitdown.read() using the contents of the file', async () => {
      const gitdown = await Gitdown.readFile(path.resolve(dirname, './fixtures/foo.txt'));

      gitdown.setConfig({
        gitinfo: {
          gitPath: path.resolve(dirname, './dummy_git/'),
        },
      });

      const response = await gitdown.get();

      expect(response).to.equal('bar');
    });
  });

  describe('prefixRelativeUrls', () => {
    it('replaces relative links', () => {
      expect(Gitdown.prefixRelativeUrls('A [relative](#link) test')).to.equal('A [relative](#user-content-link) test');
    });
  });

  describe('.nestHeadingIds()', () => {
    it('replaces heading markup with HTML', () => {
      expect(
        Gitdown.nestHeadingIds('# Foo\n# Bar'),
      ).to.equal(
        '<a name="user-content-foo"></a>\n<a name="foo"></a>\n# Foo\n<a name="user-content-bar"></a>\n<a name="bar"></a>\n# Bar',
      );
    });
    it('nests heading ids', () => {
      expect(
        Gitdown.nestHeadingIds('# Foo\n## Bar'),
      ).to.equal(
        '<a name="user-content-foo"></a>\n<a name="foo"></a>\n# Foo\n<a name="user-content-foo-bar"></a>\n<a name="foo-bar"></a>\n## Bar',
      );
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
              id: 'b',
            },
            {
              descendants: [],
              id: 'c',
            },
          ],
          id: 'a',
        },
        {
          descendants: [],
          id: 'd',
        },
      ];

      Gitdown.nestHeadingIds.iterateTree(tree, (index, leaf) => {
        result.push(index + '-' + leaf.id);
      });

      expect(result).to.deep.equal([
        '1-a',
        '2-b',
        '3-c',
        '4-d',
      ]);
    });
  });
});

describe('Gitdown.read()', () => {
  let Gitdown;

  beforeEach(async () => {
    Gitdown = (await importFresh('../src/index.js')).default;
  });
  describe('.get()', () => {
    it('is using Parser to produce the response', async () => {
      const gitdown = await Gitdown.read('{"gitdown": "test"}', {
        gitPath: path.resolve(dirname, './dummy_git/'),
      });

      const response = await gitdown.get();

      expect(response).to.equal('test');
    });
    it('removes all gitdown specific HTML comments', async () => {
      const gitdown = await Gitdown.read('a<!-- gitdown: on -->b<!-- gitdown: off -->c', {
        gitPath: path.resolve(dirname, './dummy_git/'),
      });

      const response = await gitdown.get();

      expect(response).to.equal('abc');
    });
    it('does not fail when HEAD is untracked', async () => {
      const gitdown = await Gitdown.read('{"gitdown": "gitinfo", "name": "name"}', {
        defaultBranchName: 'master',
        gitPath: path.resolve(dirname, './dummy_git_untracked_head/'),
      });

      const response = await gitdown.get();

      expect(response).to.equal('bar');
    });
  });
  describe('.writeFile()', () => {
    it('writes the output of .get() to a file', async () => {
      const fileName = path.resolve(dirname, './fixtures/write.txt');
      const randomString = String(Math.random());
      const gitdown = await Gitdown.read(randomString, {
        gitPath: path.resolve(dirname, './dummy_git/'),
      });

      await gitdown.writeFile(fileName);

      expect(fs.readFileSync(fileName, {
        encoding: 'utf8',
      })).to.equal(randomString);
    });
  });
  describe('.registerHelper()', () => {
    it('throws an error if registering a helper using name of an existing helper', async () => {
      const gitdown = await Gitdown.read('', {
        gitPath: path.resolve(dirname, './dummy_git/'),
      });

      expect(() => {
        gitdown.registerHelper('test');
      }).to.throw(Error, 'There is already a helper with a name "test".');
    });
    it('throws an error if registering a helper object without compile property', async () => {
      const gitdown = await Gitdown.read('', {
        gitPath: path.resolve(dirname, './dummy_git/'),
      });

      expect(() => {
        gitdown.registerHelper('new-helper');
      }).to.throw(Error, 'Helper object must defined "compile" property.');
    });
    it('registers a new helper', async () => {
      const gitdown = await Gitdown.read('{"gitdown": "new-helper", "testProp": "foo"}', {
        gitPath: path.resolve(dirname, './dummy_git/'),
      });

      gitdown.registerHelper('new-helper', {
        compile (config) {
          return 'Test prop: ' + config.testProp;
        },
      });

      const markdown = await gitdown.get();

      expect(markdown).to.equal('Test prop: foo');
    });
  });
  xdescribe('.setConfig()', () => {
    let defaultConfiguration;

    beforeEach(() => {
      defaultConfiguration = {
        deadlink: {
          findDeadFragmentIdentifiers: false,
          findDeadURLs: false,
        },
        gitinfo: {
          gitPath: dirname,
        },
        headingNesting: {
          enabled: true,
        },
        variable: {
          scope: {},
        },
      };
    });
    it('returns the current configuration', async () => {
      const gitdown = await Gitdown.read('');
      const config = gitdown.config;

      expect(config).to.deep.equal(defaultConfiguration);
    });
    it('sets a configuration', async () => {
      const gitdown = await Gitdown.read('');

      gitdown.config = defaultConfiguration;

      expect(defaultConfiguration).to.equal(gitdown.config);
    });
  });
  describe.skip('.resolveURLs()', () => {
    let gitdown;
    let logger;
    let nocks;

    beforeEach(async () => {
      gitdown = await Gitdown.read('http://foo.com/ http://foo.com/#ok http://bar.com/ http://bar.com/#not-ok', {
        gitPath: path.resolve(dirname, './dummy_git/'),
      });

      logger = {
        info () {},
        warn () {},
      };

      gitdown.setLogger(logger);

      logger = gitdown.getLogger();

      nocks = {};
      nocks.foo = nock('http://foo.com').get('/').reply(200, '<div id="ok"></div>', {
        'content-type': 'text/html',
      });
      nocks.bar = nock('http://bar.com').get('/').reply(404);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('it does not resolve URLs when config.deadlink.findDeadURLs is false', async () => {
      gitdown.setConfig({
        deadlink: {
          findDeadFragmentIdentifiers: false,
          findDeadURLs: false,
        },
      });

      await gitdown.get();

      expect(nocks.foo.isDone()).to.equal(false);
    });
    it('it does resolve URLs when config.deadlink.findDeadURLs is true', async () => {
      gitdown.setConfig({
        deadlink: {
          findDeadFragmentIdentifiers: false,
          findDeadURLs: true,
        },
      });

      await gitdown.get();

      expect(nocks.foo.isDone()).to.equal(true);
    });
    it('logs successful URL resolution using logger.info', async () => {
      const spyValue = spy(logger, 'info');

      gitdown.setConfig({
        deadlink: {
          findDeadFragmentIdentifiers: false,
          findDeadURLs: true,
        },
      });

      await gitdown.get();

      expect(spyValue.calledWith('Resolved URL:', 'http://foo.com/')).to.equal(true);
    });
    it('logs successful URL and fragment identifier resolution using logger.info', async () => {
      const spyValue = spy(logger, 'info');

      gitdown.setConfig({
        deadlink: {
          findDeadFragmentIdentifiers: true,
          findDeadURLs: true,
        },
      });

      await gitdown.get();

      expect(spyValue.calledWith('Resolved fragment identifier:', 'http://foo.com/#ok')).to.equal(true);
    });
    it('logs unsuccessful URL resolution using logger.warn', async () => {
      const spyValue = spy(logger, 'warn');

      gitdown.setConfig({
        deadlink: {
          findDeadFragmentIdentifiers: true,
          findDeadURLs: true,
        },
      });

      await gitdown.get();

      expect(spyValue.calledWith('Unresolved URL:', 'http://bar.com/')).to.equal(true);
    });
    it('logs unsuccessful fragment identifier resolution using logger.warn', async () => {
      const spyValue = spy(logger, 'warn');

      gitdown.setConfig({
        deadlink: {
          findDeadFragmentIdentifiers: true,
          findDeadURLs: true,
        },
      });

      await gitdown.get();

      expect(spyValue.calledWith('Unresolved fragment identifier:', 'http://bar.com/#not-ok')).to.equal(true);
    });
  });
});
