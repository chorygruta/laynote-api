const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

const files = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
});

let middlewares = {};

files.forEach(file => {
  let objectFile = require("./" + file);
  middlewares[file.slice(0, -3)] = objectFile;
});

module.exports = middlewares;
