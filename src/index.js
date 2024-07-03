import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config('./.env');

import { jwtMiddleware } from "./utils/verify.js";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import mergedResolvers from "./resolvers/index.js"; 
import mergedTypeDefs from "./typeDefs/index.js";

import connectDB from "./db/index.js";

const app = express();

const httpServer = http.createServer(app);

// const server = new ApolloServer({
//     typeDefs: mergedTypeDefs,
//     resolvers:  mergedResolvers,
//     introspection: true,
//     plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  
//   });

// const server = new ApolloServer({
//   typeDefs: mergedTypeDefs,
//   resolvers: mergedResolvers,
//   introspection: true,
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   context: ( req ) => {
//     // Pass req.emp from jwtMiddleware to the resolvers

//     console.log("inside the ApolloSeerver req.emp ->", req)
//     return { emp: req.emp };
//   },
// });


// const context = ({ req }) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token) {
//       try {
//           const user = jwt.verify(token, process.env.JWT_SECRET);
//           return { user };
//       } catch (err) {
//           console.log('Invalid access token');
//       }
//   }
//   return {};
// };


// const server = new ApolloServer({
//   typeDefs: mergedTypeDefs,
//   resolvers: mergedResolvers,
//   introspection: true,
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   // context: ({ req }) => {
//   //   return  req.emp ;
//   // },
  
//   context: async ({ req }) => {
//     return { emp: req.emp };
//   },
// });


const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  introspection: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  // context: ({ req }) => {

  //   // Extract the JWT from the request header and verify it
  //   // jwtMiddleware should have set req.emp with decoded token

  //   const emp = req.emp;

  //   // Pass any additional data you need in the context
  //   // return { emp };
  //   return { emp, otherData: 'exampleData' };
  // },
});
  await server.start();

  app.use(
    '/graphql',
    jwtMiddleware,  // Middleware to handle JWT verification and attach `req.emp`
    cors({ origin: ['https://studio.apollographql.com', '*'] }),  // CORS configuration
    express.json(),  // Middleware to parse JSON request bodies
    expressMiddleware(server, {
      context: ({ req }) => {
        const emp = req.emp;
        return {
          emp
        };
      },
    })
  );
  

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  await connectDB();
  
  console.log(`🚀 Server ready at  http://localhost:4000/graphql`);