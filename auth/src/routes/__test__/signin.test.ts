import request from "supertest";
import { app } from "../../app";

it("fails with an email that does not exist supplied", async() => {
   return request(app)
          .post("/api/users/signin")
          .send({
              email: "test@test.com",
              password: "password"
          })
          .expect(400);
});


it("fails with an incorrect password is supplied", async() => {
    await request(app)
           .post("/api/users/signup")
           .send({
               email: "test@test.com",
               password: "password"
           })
           .expect(201);    
    await request(app)
           .post("/api/users/signin")
           .send({
               email: "test@test.com",
               password: "pas"
           })
           .expect(400);
 });


 it("fails with cookie when given valid credentials", async() => {
    await request(app)
           .post("/api/users/signup")
           .send({
               email: "test@test.com",
               password: "password"
           })
           .expect(201);
    const response: any = await request(app)
           .post("/api/users/signin")
           .send({
               email: "test@test.com",
               password: "password"
           })
           .expect(201);
           expect(response.get("Set-Cookie")).toBeDefined();
 });