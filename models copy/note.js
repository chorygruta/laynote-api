// 'use strict';

module.exports = (sequelize, DataTypes) => {
  let Note = sequelize.define(
    "note",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      indexes: []
    }
  );

  return Note;
};
