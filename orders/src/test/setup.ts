import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
    namespace NodeJS {
        interface Global {            
            signin(): string[];
        }
    }
}

jest.mock("../nats-wrapper");

let mongo: any;
beforeAll(async() => {
    process.env.JWT_KEY = "testKey";
    mongo = new MongoMemoryServer();
    const mongoUri: any = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async() => {
     jest.clearAllMocks();
      const collections: any = await mongoose.connection.db.collections();
      for (let collection of collections) {
          await collection.deleteMany();
      }
});

afterAll(async() => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
   /* Build a JWT payload {id, email} */
    const payload: any = {
       id:  new mongoose.Types.ObjectId().toHexString(),
       email: "test@test.com"
    };
   /* Create the JWT */
   const token: any = jwt.sign(payload, process.env.JWT_KEY!);
   /* Build Session Object {jwt: MY_JWT} */
  const session: any = {jwt: token};
   /* Turn that session into JSON */
   const sessionJson: any = JSON.stringify(session);
   /* return a string thats the cookie with the encoded data */
   const base64: any = Buffer.from(sessionJson).toString("base64");

   return [`express:sess=${base64}`];

};