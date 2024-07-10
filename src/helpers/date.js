import moment from 'moment';

const date = {};
date.compile = (config = {}) => {
  config.format = config.format || 'X';

  return moment().format(config.format);
};

date.weight = 10;

export default date;
