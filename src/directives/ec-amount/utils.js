import defaults from './options';

function format(input, opt = defaults) {
  if (input === '' || input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'number') {
    input = input.toString();
  }

  const negative = input.startsWith('-') ? '-' : '';

  input = sanitizeInput(input, opt.decimalSeparator);
  if (opt.precision > 0) {
    input = keepOnlyOneDecimalSeparator(input, opt.decimalSeparator);
  } else {
    input = removeDecimal(input, opt.decimalSeparator);
  }
  const parts = input.split(opt.decimalSeparator);
  let integer = parseToStr(parts[0]);
  let decimal = parts[1];

  if (decimal && decimal.length > opt.precision) {
    decimal = decimal.substr(0, opt.precision);
  }

  integer = addGroupingSeparators(integer, opt.groupingSeparator);
  const result = negative + joinIntegerAndDecimal(integer, decimal, opt.decimalSeparator);
  return result;
}

function parseToStr(number) {
  const parsed = Number.parseFloat(number);
  if (Number.isNaN(parsed)) {
    return '';
  }
  return parsed.toString();
}

function keepOnlyOneDecimalSeparator(number, decimalSeparator) {
  if (number.includes(decimalSeparator)) {
    const split = number.split(decimalSeparator);
    return split[0] + decimalSeparator + split.slice(1).join('');
  }
  return number;
}

function removeDecimal(number, decimalSeparator) {
  const split = number.split(decimalSeparator);
  return split[0];
}

function unFormat(input, groupingSeparator, decimalSeparator) {
  /* eslint no-param-reassign: "off" */
  input = (`${input}`).replace(new RegExp(`\\${groupingSeparator}`, 'g'), '');
  input = (`${input}`).replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.');
  return input;
}

function sanitizeInput(input, decimalSeparator) {
  return input.replace(new RegExp(`[^0-9${decimalSeparator}]`, 'g'), '') || '';
}

function addGroupingSeparators(integer, separator) {
  return integer.replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separator}`);
}

function joinIntegerAndDecimal(integer, decimal, decimalSeparator) {
  return decimal !== undefined ? integer + decimalSeparator + decimal : integer;
}

/* c8 ignore start */
function setCursor(el, position) {
  const setSelectionRange = function setSelectionRange() {
    el.setSelectionRange(position, position);
  };

  if (el === document.activeElement) {
    setSelectionRange();
    setTimeout(setSelectionRange, 1); // Android Fix
  }
}
/* c8 ignore stop */

export {
  format,
  sanitizeInput,
  setCursor,
  unFormat,
};
