const dayJs = require('dayjs');

const isDate = (value) => {
  if (!value) {
    return false;
  }

  const fecha = dayJs(value);

  if (fecha.isValid()) {
    return true;
  } else {
    return false;
  }
};

module.exports = { isDate };
