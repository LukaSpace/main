const fs = require('fs-extra');
fs.move('docs/browser', 'docs', { overwrite: true }, err => {
  if (err) {
    return console.error(err);
  }
});
