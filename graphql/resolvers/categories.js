const helpers = require("../helpers");
const {
  UserInputError,
  AuthenticationError,
  ApolloError
} = require("apollo-server-express");

module.exports = {
  Query: {
    categories: async (parent, args, context) => {
      const { db, req } = context;
      await global.requireToken(req);

      const categories = await db.category.findAll({
        where: {
          userId: context.req.decoded.userId
        },
        raw: true
      });

      return categories.map(category => {
        return {
          ...category,
          notes: helpers.getNotesByCategoryId.bind(this, context, category.id)
        };
      });
    },

    category: async (parent, args, context) => {
      const { db, req } = context;
      await global.requireToken(req);

      const category = await db.category.findOne({
        where: {
          id: args.id,
          userId: context.req.decoded.userId
        },
        raw: true
      });

      if (!category) {
        throw new ApolloError(
          "Category based on provided ID doesn't exist",
          "ENOENT"
        );
      }

      return {
        ...category,
        notes: helpers.getNotesByCategoryId.bind(this, context, category.id)
      };
    }
  },
  Mutation: {
    createCategory: async (parent, args, context) => {
      const { db, req } = context;
      await global.requireToken(req);

      // find if the provided category name already exists
      const existingCategory = await db.category.findOne({
        where: {
          name: args.body.name,
          userId: req.decoded.userId
        }
      });

      if (existingCategory) {
        throw new UserInputError(
          "Unable to create new category. A category with the same name already exists."
        );
      }

      // create category
      const category = await db.category
        .create({
          name: args.body.name,
          userId: context.req.decoded.userId
        })
        .then(category =>
          category.get({
            plain: true
          })
        );

      return {
        category: {
          ...category,
          notes: helpers.getNotesByCategoryId.bind(this, context, category.id)
        },
        message: "A new category has been created."
      };
    },

    updateCategory: async (parent, args, context) => {
      const { db, req } = context;
      await global.requireToken(req);

      if (!args.body) {
        throw new UserInputError(
          "Unable to update category. Body input can't be empty."
        );
      }

      // Check if category exists. Must include userId to prevent a user from using other users' categories
      const existingCategory = await db.category.findOne({
        where: {
          id: args.id,
          userId: req.decoded.userId
        },
        raw: true
      });

      if (!existingCategory) {
        throw new ApolloError(
          "Unable to update category. Category based on provided ID doesn't exist",
          "ENOENT"
        );
      }

      const [isSuccess] = await db.category.update(args.body, {
        where: {
          id: args.id
        },
        raw: true
      });

      if (!isSuccess) {
        throw new ApolloError("Unable to update category", "BAD_REQUEST");
      }

      const updatedCategory = await db.category.findByPk(args.id, {
        raw: true
      });

      return {
        old_category: {
          ...existingCategory,
          notes: helpers.getNotesByCategoryId.bind(
            this,
            context,
            existingCategory.id
          )
        },
        updated_category: {
          ...updatedCategory,
          notes: helpers.getNotesByCategoryId.bind(
            this,
            context,
            updatedCategory.id
          )
        },
        message: "Category has been updated successfully"
      };
    },

    deleteCategory: async (parent, args, context) => {
      const { db, req } = context;
      await global.requireToken(req);

      // Check if category exists. Must include userId to prevent a user from using other users' categories
      const existingCategory = await db.category.findOne({
        where: {
          id: args.id,
          userId: req.decoded.userId
        },
        raw: true
      });

      if (!existingCategory) {
        throw new ApolloError(
          "Unable to delete category. Category based on provided ID doesn't exist",
          "ENOENT"
        );
      }

      await existingCategory.destroy();

      return {
        deleted_id: args.id,
        message: "Note has been deleted successfully."
      };
    }
  }
};
