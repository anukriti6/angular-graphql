import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { GraphQLError } from "graphql";
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  enum CheckinWindow{
    PRE
    OPEN
    CLOSED
  } 
  type Response {
    checkin: Checkin
    message: String
  }
  type Checkin {
    bookingCode: String
    fName: String
    checkinStatus:Boolean
    checkinWindow: CheckinWindow

  }
  type Query {
    checkin: [Checkin]
  }
  type Mutation {
   
    doCheckin(bookingCode:String!, fname: String!): Response
  }
`;

const bookings = [
  {
    bookingCode: "K12345",
    fName: "Gupta",
    checkinStatus: true,
    checkinWindow: "CLOSED",
  },
  {
    bookingCode: "K23456",
    fName: "Singh",
    checkinStatus: false,
    checkinWindow: "PRE",
  },
  {
    bookingCode: "K34567",
    fName: "Bankar",
    checkinStatus: false,
    checkinWindow: "OPEN",
  },
  {
    bookingCode: "K45678",
    fName: "JOHN",
    checkinStatus: false,
    checkinWindow: "CLOSED",
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    checkin: () => bookings,
  },
  Mutation: {
    doCheckin: (_, { bookingCode, fname }) => {
      if (!bookingCode || !fname) {
        throw new GraphQLError("invalid Data", {
          extensions: {
            CODE: "9006",
            http: {
              status: 400,
            },
          },
        });
      }
      let booking = bookings.filter(
        (booking) =>
          booking.bookingCode.toLowerCase() === bookingCode.toLowerCase()
      );
      console.log(booking);

      if (!booking || booking.length != 1) {
        throw new GraphQLError("invalid booking code", {
          extensions: {
            CODE: "9001",
            http: {
              status: 400,
            },
          },
        });
      }
      if (booking[0].fName.toLowerCase() !== fname.toLowerCase()) {
        throw new GraphQLError("invalid family name", {
          extensions: {
            CODE: "9002",
            http: {
              status: 400,
            },
          },
        });
      }
      if (booking[0].checkinWindow === "PRE") {
        throw new GraphQLError("Checkin not available yet for this fligt", {
          extensions: {
            CODE: "9003",
            http: {
              status: 400,
            },
          },
        });
      }
      if (booking[0].checkinWindow === "CLOSED") {
        throw new GraphQLError("Sorry online checkin closed for this flight", {
          extensions: {
            CODE: "9004",
            http: {
              status: 400,
            },
          },
        });
      }
      booking[0].checkinStatus = true;
      return {checkin: booking[0], message:'Check In is successful'};
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests

interface MyContext {
  token?: String;
}

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  "/newapp/checkin",
  cors<cors.CorsRequest>(),
  // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
  bodyParser.json({ limit: "50mb" }),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

// Modified server startup
await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);
console.log(`🚀 Server ready at http://localhost:4000/`);
