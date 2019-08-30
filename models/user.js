// 'use strict';

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      unique_id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      email_address: {
        type: DataTypes.STRING,
        allowNull: true,
        isEmail: {
          args: true,
          msg: "Email address is not valid."
        }
      },
      hashed_password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["email_address"]
        }
      ]
    }
  );

  User.associate = models => {
    User.hasMany(models.note, { foreignKey: "userId" });
    User.hasMany(models.category, { foreignKey: "userId" });
  };

  return User;
};
