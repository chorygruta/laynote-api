const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator");
const schema = new passwordValidator();
const helpers = require("../helpers/index");

const {
  UserInputError,
  AuthenticationError,
  ApolloError,
  ForbiddenError
} = require("apollo-server-express");

schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits();

module.exports = {
  Query: {
    /* users: async (parent, args, context) => {
      await global.requireToken(context.req);

      // set up filter
      let filter = {};

      if (args.filter) {
        filter = { ...args.filter };
        if (args.filter.last_name || args.filter.first_name) {
          filter = {
            ...args.filter,
            [db.op.or]: [
              {
                first_name: {
                  [db.op.like]: "%" + args.filter.first_name + "%"
                }
              },
              {
                first_name: {
                  [db.op.like]: "%" + args.filter.last_name + "%"
                }
              },
              {
                last_name: {
                  [db.op.like]: "%" + args.filter.first_name + "%"
                }
              },
              {
                last_name: {
                  [db.op.like]: "%" + args.filter.last_name + "%"
                }
              }
            ]
          };
        }
      }

      const users = await db.user.findAll({ raw: true, where: filter });

      return users.map(user => {
        return {
          ...user
        };
      });
    }, */
    me: async (parent, args, context) => {
      const { db, req } = context;
      await global.requireToken(req);

      const user = await db.user.findByPk(req.decoded.userId, {
        raw: true
      });

      if (!user) {
        throw new ApolloError(
          "Unable to retrieve user profile. Provided token is invalid.",
          "ENOENT"
        );
      }
      return {
        ...user
      };
    }
  },
  Mutation: {
    signup: async (parent, args, context) => {
      const { db, req } = context;
      const email_address = args.body.email_address.toLowerCase();

      // Check if the email_address is already in use
      const existingUser = await db.user.findOne({
        where: {
          email_address: email_address
        }
      });

      if (existingUser) {
        throw new UserInputError("Provided email address is already in use.");
      }

      // Check if the email_address is valid
      const emailValidation = /\S+@\S+\.\S+/;

      if (!emailValidation.test(email_address)) {
        throw new UserInputError(
          "Provided email address is invalid. Please enter a valid email address."
        );
      }

      if (!schema.validate(args.body.password)) {
        throw new UserInputError(
          "Password does not meet the requirements. Please enter a new password."
        );
      }

      const hashedPassword = await bycrypt.hash(args.body.password, 12);

      const user = await db.user.create({
        email_address: email_address,
        hashed_password: hashedPassword
      });

      const token = jwt.sign(
        {
          userId: user.id,
          last_login: user.last_login
        },
        process.env.app_secret,
        {
          expiresIn: "1d"
        }
      );

      return {
        userId: user.id,
        token: token,
        message: "You have signed up successfully "
      };
    },

    login: async (parent, args, context) => {
      const { db, req } = context;
      const email_address = args.body.email_address.toLowerCase();

      const user = await db.user.findOne({
        where: {
          email_address: email_address
        }
      });

      if (!user) {
        throw new AuthenticationError("Invalid email address.");
      }

      const isEqual = await bycrypt.compare(
        args.body.password,
        user.hashed_password
      );

      if (!isEqual) {
        throw new AuthenticationError("Incorrect Password.");
      }

      await user.update({
        last_login: Date.now()
      });

      const token = jwt.sign(
        {
          userId: user.id,
          last_login: user.last_login
        },
        process.env.app_secret,
        {
          expiresIn: "1d"
        }
      );

      return {
        userId: user.id,
        token: token,
        message: "You have logged in successfully "
      };
    },

    updateUser: async (parent, args, context) => {
      const { db, req } = context;
      await global.requireToken(req);

      if (!args.body) {
        throw new UserInputError(
          "Unable to update user. Body input can't be empty."
        );
      }

      if (req.decoded.userId !== parseInt(args.id)) {
        throw new ForbiddenError(
          "Unable to update user. You are not authorized to update this user."
        );
      }

      const existingUser = await db.user.findByPk(req.decoded.userId, {
        raw: true
      });

      const [isSuccess] = await db.user.update(args.body, {
        where: {
          id: req.decoded.userId
        },
        raw: true
      });

      if (!isSuccess) {
        throw new ApolloError("Unable to update note.", "BAD_REQUEST");
      }

      const updatedUser = await db.user.findByPk(req.decoded.userId, {
        raw: true
      });

      return {
        old_user: existingUser,
        updated_user: updatedUser,
        message: "User has been updated successfully."
      };
    }
  }
};
