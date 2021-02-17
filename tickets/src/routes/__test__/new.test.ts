import  request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../__mocks__/nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
   const response: any = await request(app)
      .post("/api/tickets")
      .send({});

      expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {

    await request(app)
          .post("/api/tickets")
          .send({})
          .expect(401);

});

it("retruns a status other than 401 if the user is signed in", async () => {
   const response: any = await request(app)
   .post("/api/tickets").send({})
   .set("Cookie", global.signin());
   expect(response.status).not.toEqual(401);
});

it("retruns an error if an invalid title is provided", async () => {
   await request(app)
   .post("/api/tickets")
   .set("Cookie", global.signin())
   .send({
      title: "",
      price: 10
   })
   .expect(400);
});

it("creates a tickets with valid inputs", async () => {
    let tickets: any = await Ticket.find({});
    expect(tickets.length).toEqual(0);

   await request(app)
   .post("/api/tickets")
   .set("Cookie", global.signin())
   .send({
      title: "adcasdsasd",
      price: 10
   })
   .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(10);
});

it("published an Event", async () => {
   const title: string = "adcasdsasd";

   await request(app)
   .post("/api/tickets")
   .set("Cookie", global.signin())
   .send({
      title,
      price: 10
   })
   .expect(201);
   expect(natsWrapper.client.publish).toHaveBeenCalled();
   
});