const fs = require('fs-extra');
fs.copySync('docs/browser', 'docs', { overwrite: true }, err => {
  if (err) {
    return console.error(err);
  }
});
fs.removeSync('docs/browser', err => {
  if (err) {
    return console.error(err);
  }
});
