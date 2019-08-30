// 'use strict';

module.exports = (sequelize, DataTypes) => {
  let Category = sequelize.define(
    "category",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      indexes: []
    }
  );

  Category.associate = models => {
    Category.hasMany(models.note, { foreignKey: "categoryId" });
  };

  return Category;
};
