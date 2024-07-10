import { dirname } from 'path';
import { fileURLToPath } from 'url';

import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

const __dirname = dirname(fileURLToPath(import.meta.url));

const importFresh = (moduleName) => import(`${moduleName}?${Date.now()}`);

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('Gitdown.Parser', () => {
  let Parser;
  let parser;
  let spy;

  beforeEach(async () => {
    Parser = (await importFresh('./../src/index.js')).default.Parser;
    parser = await Parser();
  });
  afterEach(() => {
    if (spy) {
      spy.restore();
    }
  });
  it('returns the input content', async () => {
    const state = await parser.play('foo');

    expect(state.markdown).to.equal('foo');
  });
  it('ignores content starting with a <!-- gitdown: off --> HTML comment tag', async () => {
    const state = await parser.play('{"gitdown": "test"}<!-- gitdown: off -->{"gitdown": "test"}');

    expect(state.markdown).to.equal('test<!-- gitdown: off -->{"gitdown": "test"}');
  });
  it('ignores content between <!-- gitdown: off --> and <!-- gitdown: on --> HTML comment tags', async () => {
    const state = await parser.play('<!-- gitdown: off -->{"gitdown": "test"}<!-- gitdown: on --><!-- gitdown: off -->{"gitdown": "test"}<!-- gitdown: on -->');

    expect(state.markdown).to.equal('<!-- gitdown: off -->{"gitdown": "test"}<!-- gitdown: on --><!-- gitdown: off -->{"gitdown": "test"}<!-- gitdown: on -->');
  });
  it('interprets JSON starting with \'{"gitdown"\' and ending with \'}\'', async () => {
    const state = await parser.play('{"gitdown": "test"}{"gitdown": "test"}');

    expect(state.markdown).to.equal('testtest');
  });
  it('throws an error if invalid Gitdown JSON hook is encountered', () => {
    const statePromise = parser.play('{"gitdown": invalid}');

    return expect(statePromise).to.be.rejectedWith(Error, 'Invalid Gitdown JSON ("{"gitdown": invalid}").');
  });
  it('invokes a helper function with the markdown', async () => {
    spy = sinon.spy(parser.helpers().test, 'compile');

    await parser.play('{"gitdown": "test", "foo": "bar"}');

    expect(spy.calledWith({
      foo: 'bar',
    })).to.be.equal(true);
  });
  it('throws an error if an unknown helper is invoked', () => {
    const statePromise = parser.play('{"gitdown": "does-not-exist"}');

    return expect(statePromise).to.be.rejectedWith(Error, 'Unknown helper "does-not-exist".');
  });
  it('descends to the helper with the lowest weight after each iteration', async () => {
    parser = await Parser({
      getConfig: () => {
        return {
          baseDirectory: __dirname,
        };
      },
    });

    // Helper "include" is weight 20
    // Helper "test" is weight 10
    const state = await parser.play('{"gitdown": "include", "file": "./fixtures/include_test_weight_10.txt"}');

    expect(state.markdown).to.equal('test');
  });
});

describe('Parser.helpers', async () => {
  const glob = await import('glob');
  const path = await import('path');

  for (const helperName of glob.sync('./../src/helpers/*.js')) {
    const helper = await import(helperName);

    describe(path.basename(helperName, '.js'), () => {
      it('has compile method', () => {
        expect(helper).to.have.property('compile');
      });
      it('has weight property', () => {
        expect(helper).to.have.property('weight');
      });
    });
  }
});
