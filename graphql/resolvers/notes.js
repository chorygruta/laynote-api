const helpers = require("../helpers");
const { UserInputError, ApolloError } = require("apollo-server-express");

module.exports = {
  Query: {
    notes: async (parent, args, context) => {
      const { db, req } = context;
      await global.requireToken(req);

      const filter = args.filter
        ? { ...args.filter, userId: req.decoded.userId }
        : { userId: req.decoded.userId };

      const notes = await db.note.findAll({
        where: filter,
        raw: true
      });

      return notes.map(note => {
        return {
          ...note,
          category: note.categoryId
            ? helpers.getCategoryById.bind(this, context, note.categoryId)
            : null
        };
      });
    },

    note: async (parent, args, context) => {
      const { db, req } = context;
      await global.requireToken(req);

      const note = await db.note.findOne({
        where: {
          id: args.id,
          userId: req.decoded.userId
        },
        raw: true
      });

      if (!note) {
        throw new ApolloError(
          "Note based on provided ID doesn't exist",
          "ENOENT"
        );
      }

      return {
        ...note,
        category: note.categoryId
          ? helpers.getCategoryById.bind(this, context, note.categoryId)
          : null
      };
    }
  },
  Mutation: {
    createNote: async (parent, args, context) => {
      const { db, req, loaders } = context;
      await global.requireToken(req);

      const Additionalfilter = {};

      if (args.body.categoryId) {
        // check if a category created by the user exists. This prevents a user from using other users' categories
        const existingCategory = await db.category.findOne({
          where: {
            id: args.body.categoryId,
            userId: req.decoded.userId
          },
          raw: true
        });

        // A category created by the same user doesn't exist
        if (!existingCategory) {
          throw new ApolloError(
            "Unable to create note. A category based on provided categoryId doesn't exist.",
            "ENOENT"
          );
        }

        Additionalfilter.categoryId = args.body.categoryId;
      }

      // find if the provided category name already exists
      const existingNote = await db.note.findOne({
        where: {
          title: args.body.title,
          userId: req.decoded.userId,
          ...Additionalfilter
        }
      });

      if (existingNote) {
        throw new UserInputError(
          "Unable to create new note. A note with the same title already exists."
        );
      }

      // create note
      const note = await db.note
        .create({
          title: args.body.title,
          content: args.body.content,
          categoryId: args.body.categoryId,
          userId: req.decoded.userId
        })
        .then(note =>
          note.get({
            plain: true
          })
        );

      return {
        note: {
          ...note,
          category: note.categoryId
            ? helpers.getCategoryById.bind(this, context, note.categoryId)
            : null
        },
        message: "A new note has been created."
      };
    },

    updateNote: async (parent, args, context) => {
      const { db, req } = context;
      await global.requireToken(req);

      if (!args.body) {
        throw new UserInputError(
          "Unable to update note. Body input can't be empty."
        );
      }

      // Check if note exists. Must include userId to prevent a user from using other users' notes
      const existingNote = await db.note.findOne({
        where: {
          id: args.id,
          userId: req.decoded.userId
        },
        raw: true
      });

      if (!existingNote) {
        throw new ApolloError(
          "Unable to update note. Note based on provided ID doesn't exist",
          "ENOENT"
        );
      }

      const [isSuccess] = await db.note.update(args.body, {
        where: {
          id: args.id
        },
        raw: true
      });

      if (!isSuccess) {
        throw new ApolloError("Unable to update note", "BAD_REQUEST");
      }

      const updatedNote = await db.note.findByPk(args.id, {
        raw: true
      });

      return {
        old_note: {
          ...existingNote,
          category: existingNote.categoryId
            ? helpers.getCategoryById.bind(
                this,
                context,
                existingNote.categoryId
              )
            : null
        },
        updated_note: {
          ...updatedNote,
          category: updatedNote.categoryId
            ? helpers.getCategoryById.bind(
                this,
                context,
                updatedNote.categoryId
              )
            : null
        },
        message: "Note has been updated successfully"
      };
    },

    deleteNote: async (parent, args, context) => {
      const { db, req } = context;
      await global.requireToken(req);

      // Check if note exists. Must include userId to prevent a user from using other users' notes
      const existingNote = await db.note.findOne({
        where: {
          id: args.id,
          userId: req.decoded.userId
        },
        raw: true
      });

      if (!existingNote) {
        throw new ApolloError(
          "Unable to delete note. Note based on provided ID doesn't exist",
          "ENOENT"
        );
      }

      await existingNote.destroy();

      return {
        deleted_id: args.id,
        message: "Note has been deleted successfully."
      };
    }
  }
};
