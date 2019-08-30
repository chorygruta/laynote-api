module.exports = async (context, categoryId) => {
  const { db, loaders } = context;
  const helpers = require("../helpers");

  const category = await loaders.categories.load(categoryId);

  return {
    ...category,
    notes: helpers.getNotesByCategoryId.bind(this, context, categoryId)
  };
};
