const fs = require("fs");

function callback(err) {
  if (err) throw err;
  console.log('dist was copied to static');
}

fs.cp('dist', './backend/app/static/dist', {recursive: true}, callback)