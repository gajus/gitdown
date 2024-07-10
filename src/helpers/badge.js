import fs from 'fs';
import jsonfile from 'jsonfile';

const badge = {};
badge.compile = (config = {}, context) => {
  const services = {};

  if (!config.name) {
    throw new Error('config.name must be provided.');
  }

  const badgeStyle = 'style=flat-square';

  services['npm-version'] = () => {
    let pkg;

    pkg = context.locator.repositoryPath() + '/package.json';

    if (!fs.existsSync(pkg)) {
      throw new Error('./package.json is not found.');
    }

    pkg = jsonfile.readFileSync(pkg);

    const theBadge = '![NPM version](http://img.shields.io/npm/v/' + pkg.name + '.svg?' + badgeStyle + ')';

    return '[' + theBadge + '](https://www.npmjs.org/package/' + pkg.name + ')';
  };

  services['bower-version'] = () => {
    let bower;

    bower = context.locator.repositoryPath() + '/bower.json';

    if (!fs.existsSync(bower)) {
      throw new Error('./bower.json is not found.');
    }

    bower = jsonfile.readFileSync(bower);

    const theBadge = '![Bower version](http://img.shields.io/bower/v/' + bower.name + '.svg?' + badgeStyle + ')';

    return '[' + theBadge + '](http://bower.io/search/?q=' + bower.name + ')';
  };

  /**
   * @see https://github.com/gajus/gitdown/issues/10
   */
  services.david = () => {
    const gitinfo = context.parser.helpers().gitinfo;
    const repository = gitinfo.compile({
      name: 'username',
    }, context) + '/' + gitinfo.compile({
      name: 'name',
    }, context);
    const theBadge = '![Dependency Status](https://img.shields.io/david/' + repository + '.svg?' + badgeStyle + ')';

    return '[' + theBadge + '](https://david-dm.org/' + repository + ')';
  };

  /**
   * @see https://github.com/gajus/gitdown/issues/10
   */
  services['david-dev'] = () => {
    const gitinfo = context.parser.helpers().gitinfo;
    const repository = gitinfo.compile({
      name: 'username',
    }, context) + '/' + gitinfo.compile({
      name: 'name',
    }, context);
    const theBadge = '![Development Dependency Status](https://img.shields.io/david/dev/' + repository + '.svg?' + badgeStyle + ')';

    return '[' + theBadge + '](https://david-dm.org/' + repository + '#info=devDependencies)';
  };

  /**
   * @see https://github.com/gajus/gitdown/issues/12
   */
  services.gitter = () => {
    const gitinfo = context.parser.helpers().gitinfo;
    const repository = gitinfo.compile({
      name: 'username',
    }, context) + '/' + gitinfo.compile({
      name: 'name',
    }, context);
    const theBadge = '![Gitter chat](https://img.shields.io/gitter/room/' + repository + '.svg?' + badgeStyle + ')';

    return '[' + theBadge + '](https://gitter.im/' + repository + ')';
  };

  /**
   * @see https://github.com/gajus/gitdown/issues/13
   */
  services.coveralls = () => {
    const gitinfo = context.parser.helpers().gitinfo;
    const repository = gitinfo.compile({
      name: 'username',
    }, context) + '/' + gitinfo.compile({
      name: 'name',
    }, context);
    const branch = gitinfo.compile({
      name: 'branch',
    }, context);
    const theBadge = '![Coverage Status](https://img.shields.io/coveralls/' + repository + '/' + branch + '.svg?' + badgeStyle + ')';

    return '[' + theBadge + '](https://coveralls.io/r/' + repository + '?branch=' + branch + ')';
  };

  /**
   * @see https://github.com/gajus/gitdown/issues/33
   */
  services.circleci = () => {
    const gitinfo = context.parser.helpers().gitinfo;
    const repository = gitinfo.compile({
      name: 'username',
    }, context) + '/' + gitinfo.compile({
      name: 'name',
    }, context);
    const branch = gitinfo.compile({
      name: 'branch',
    }, context);
    const theBadge = '![Circle CI](https://img.shields.io/circleci/project/' + repository + '/circleci/' + branch + '.svg?' + badgeStyle + ')';

    return '[' + theBadge + '](https://circleci.com/gh/' + repository + '?branch=' + branch + ')';
  };

  /**
   * @todo Link does not include travis branch.
   */
  services.travis = () => {
    const rep = {};
    const gitinfo = context.parser.helpers().gitinfo;
    const repository = gitinfo.compile({
      name: 'username',
    }, context) + '/' + gitinfo.compile({
      name: 'name',
    }, context);

    rep.branch = gitinfo.compile({
      name: 'branch',
    }, context);

    const theBadge = '![Travis build status](http://img.shields.io/travis/' + repository + '/' + rep.branch + '.svg?' + badgeStyle + ')';

    return '[' + theBadge + '](https://travis-ci.org/' + repository + ')';
  };

  services.waffle = () => {
    const gitinfo = context.parser.helpers().gitinfo;
    const repository = gitinfo.compile({
      name: 'username',
    }, context) + '/' + gitinfo.compile({
      name: 'name',
    }, context);
    const theBadge = '![Stories in Ready](https://badge.waffle.io/' + repository + '.svg?label=ready&title=Ready)';

    return '[' + theBadge + '](https://waffle.io/' + repository + ')';
  };

  /**
   * @see https://github.com/gajus/gitdown/issues/16
   */
  services['codeclimate-gpa'] = () => {
    const gitinfo = context.parser.helpers().gitinfo;
    const repository = 'github/' + gitinfo.compile({
      name: 'username',
    }, context) + '/' + gitinfo.compile({
      name: 'name',
    }, context);
    const theBadge = '![Code Climate GPA](https://img.shields.io/codeclimate/' + repository + '.svg?' + badgeStyle + ')';

    return '[' + theBadge + '](https://codeclimate.com/' + repository + ')';
  };

  services['codeclimate-coverage'] = () => {
    const gitinfo = context.parser.helpers().gitinfo;
    const repository = 'github/' + gitinfo.compile({
      name: 'username',
    }, context) + '/' + gitinfo.compile({
      name: 'name',
    }, context);
    const theBadge = '![Code Climate Coverage](https://img.shields.io/codeclimate/coverage/' + repository + '.svg?' + badgeStyle + ')';

    return '[' + theBadge + '](https://codeclimate.com/' + repository + ')';
  };

  /**
   * @see https://github.com/gajus/gitdown/issues/35
   */
  services.appveyor = () => {
    const gitinfo = context.parser.helpers().gitinfo;
    const username = gitinfo.compile({
      name: 'username',
    }, context);
    const name = gitinfo.compile({
      name: 'name',
    }, context);
    const branch = gitinfo.compile({
      name: 'branch',
    }, context);
    const repository = username + '/' + name;
    const theBadge = '![AppVeyor build status](https://img.shields.io/appveyor/ci/' + repository + '/' + branch + '.svg?' + badgeStyle + ')';

    return '[' + theBadge + '](https://ci.appveyor.com/project/' + repository + '/branch/' + branch + ')';
  };

  if (!services[config.name]) {
    throw new Error('config.name "' + config.name + '" is unknown service.');
  }

  return services[config.name]();
};

badge.weight = 10;

export default badge;
