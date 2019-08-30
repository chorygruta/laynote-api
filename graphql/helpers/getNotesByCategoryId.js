module.exports = async (context, categoryId) => {
  const { db, loaders } = context;
  const helpers = require("../helpers");

  const notes = await loaders.notes.load(categoryId);

  return notes.map(note => {
    return {
      ...note,
      category: (async id => {
        return {
          ...(await loaders.categories.load(id)),
          notes: helpers.getNotesByCategoryId.bind(this, context, categoryId)
        };
      }).bind(this, note.categoryId)
    };
  });
};
