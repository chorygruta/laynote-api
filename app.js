require("dotenv").config();
const { createServer } = require("http");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const typeDefs = require("./graphql/schemas/index");
const resolvers = require("./graphql/resolvers/index");
const middlewares = require("./middlewares");
const loaders = require("./graphql/loaders");
const DataLoader = require("dataloader");
const cors = require("cors");
const { PubSub } = require("graphql-subscriptions");
const app = express();

// Databases
const masterDB = require("./models");
global.masterDB = masterDB;

// this middleware is useful for multi-tenancy
const getDB = require("./middlewares/getDB");

app.use(cors());
app.get("/healthcheck", (req, res) => {
  return res.status(200).send();
});

app.use(middlewares.decodeToken);
global.requireToken = middlewares.requireToken;

// Apollo Server
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const server = new ApolloServer({
  schema,
  context: async ({ req, res, connection }) => {
    if (connection) {
      // subscription
      return connection.context;
    } else {
      if (req) {
        // get the specific tenant db and return it
        const db = await getDB(req);

        return {
          req,
          res,
          db,
          // include dataLoaders
          loaders: Object.assign(
            ...Object.keys(loaders).map(loaderKey => ({
              [loaderKey]: new DataLoader(keys =>
                loaders[loaderKey](keys, db, req)
              )
            }))
          )
        };
      }
    }
  },
  subscriptions: {
    onConnect: (connectionParams, webSocket) => {
      // console.log("Websocket CONNECTED");
      return {
        ...connectionParams
      };
    },
    onDisconnect: () => {
      //console.log("Websocket DISCONNECTED")
    }
  }
});

// Graphql API
server.applyMiddleware({ app, path: "/graphql-api" });

// HTTP server
const httpServer = createServer(app);

server.installSubscriptionHandlers(httpServer);

// Graphql Subscriptions
const pubsub = new PubSub();
global.pubsub = pubsub;

httpServer.listen(process.env.PORT | 8081, () => {
  console.log("Running a GraphQL API server...");
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT | 8081}${
      server.graphqlPath
    }`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${process.env.PORT | 8081}${
      server.subscriptionsPath
    }`
  );
});

/* 
Master username
admin
Master password
7s913u0uD6Z3o8SjWvdmCopy
Endpoint
laynote.cphl4stlwfxq.us-west-1.rds.amazonaws.comCopy
 */
