const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const { mergeResolvers } = require("merge-graphql-schemas");
const { GraphQLJSON } = require("graphql-type-json");

const files = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
});

let rootResolver = [];

files.forEach(file => {
  let objectFile = require("./" + file);

  rootResolver.push(objectFile);
});

let resolvers = mergeResolvers(rootResolver);

// Add custom scalar JSON. This is used for JSON datatype in mysql
resolvers.JSON = GraphQLJSON;

module.exports = resolvers;
