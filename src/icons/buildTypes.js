const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const _ = require('lodash');

function getIconNames() {
  const icons = [];
  const iconsDir = path.resolve(__dirname, '../assets/icons');
  fs.readdirSync(iconsDir).forEach((dir) => {
    fs.readdirSync(path.resolve(__dirname, `../assets/icons/${dir}`), { withFileTypes: false }).forEach((file) => {
      const enumValue = `${dir}-${file.replace('.svg', '')}`;
      icons.push([enumValue.split('-')
        .map(part => _.capitalize(part))
        .join(''), enumValue]);
    });
  });
  return icons;
}

console.log(`export enum IconName {
${
  getIconNames().map(([name, value]) => `  ${name} = '${value}'`).join(',\n')
}\n}`);