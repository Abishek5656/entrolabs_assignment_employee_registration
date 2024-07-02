import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config('./.env');

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import mergedResolvers from "./resolvers/index.js"; 
import mergedTypeDefs from "./typeDefs/index.js";

import connectDB from "./db/index.js";

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers:  mergedResolvers,
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    cors({ origin: ["https://studio.apollographql.com", "*"] }),
    express.json(),
    expressMiddleware(server)
  );

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  await connectDB();
  
  console.log(`🚀 Server ready at  http://localhost:4000/graphql`);