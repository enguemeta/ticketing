import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
    namespace NodeJS {
        interface Global {
            signin(): Promise<string[]>;
        }
    }
}

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
      const collections: any = await mongoose.connection.db.collections();
      for (let collection of collections) {
          await collection.deleteMany();
      }
});

afterAll(async() => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
    const email: string = "test@test.com";
    const password: string = "password";

    const authResponse: any =  await request(app)
    .post("/api/users/signup")
    .send({
        email,
        password
    })
    .expect(201);

    const cookie: any = authResponse.get("Set-Cookie");
      return cookie;
};