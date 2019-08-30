"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const Op = Sequelize.Op;
const db = {};

const toCamel = s => {
  return s.replace(/([-_][a-z])/gi, $1 => {
    return $1
      .toUpperCase()
      .replace("-", "")
      .replace("_", "");
  });
};

const sequelize = new Sequelize(
  process.env.master_db_name,
  process.env.master_db_user,
  process.env.master_db_password,
  {
    host: process.env.master_db_host,
    port: 3306,
    dialect: "mysql",
    define: {
      timestamps: ["created_at", "updated_at"],
      //prevent sequelize from pluralizing table names
      freezeTableName: true
    },
    dialectOptions: {
      dateStrings: true,
      typeCast: function(field, next) {
        // for reading from database
        if (field.type === "DATETIME") {
          return field.string();
        }
        return next();
      }
    },
    timezone: "+08:00", //for writing to database
    /* pool: {
      max: 5,
      min: 0,
      idle: 10000
    }, */
    logging: false
    // logging: console.log
  }
);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  // console.log(modelName);
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.op = Op;

// DB SYNC
db.sequelize
  .sync({
    alter: true
  })
  .then(() => {
    /* // Ensures that data are the same across all servers
  let defaultRolePermissions = [];

  // Adds all default permissions to Disro Super Admin
  db.permission.count()
    .then(async numberOfPermissions => {
      for (let i = 1; i < numberOfPermissions + 1; i++) {
        defaultRolePermissions.push({
          role_id: 1, permission_id: i
        });
      }
    })
    .then(() => {
      db.role_permission.bulkCreate(defaultRolePermissions, {
        ignoreDuplicates: true
      });
    }); */
  });

module.exports = db;
