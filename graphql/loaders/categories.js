module.exports = async (keys, db, req) => {
  /* console.log("category loader"); */

  const categories = await db.category.findAll({
    where: {
      id: {
        [db.op.in]: keys
      },
      userId: req.decoded.userId
    },
    raw: true
  });

  return categories;
};
