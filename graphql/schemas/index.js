// ./graphql/typeDefs.js
const path = require("path");
const { fileLoader, mergeTypes } = require("merge-graphql-schemas");
const { buildSchema } = require("graphql");

const typesArray = fileLoader(path.join(__dirname, "./"));

// Add custom scalar JSON. This is used for JSON datatype in mysql
typesArray.push("scalar JSON");

module.exports = mergeTypes(typesArray);
