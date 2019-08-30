module.exports = async (keys, db, req) => {
  /* console.log("notes loader"); */

  const notes = await db.note.findAll({
    where: {
      categoryId: {
        [db.op.in]: keys
      },
      userId: req.decoded.userId
    },
    raw: true
  });

  return [notes];
};
