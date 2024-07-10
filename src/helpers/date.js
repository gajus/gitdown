import moment from 'moment';

const helper = {};
helper.compile = (config = {}) => {
  config.format = config.format || 'X';

  return moment().format(config.format);
};

helper.weight = 10;

export default helper;
