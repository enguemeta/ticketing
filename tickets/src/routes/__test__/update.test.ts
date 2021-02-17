import { body } from 'express-validator';

import  mongoose  from "mongoose";
import  request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from '../../__mocks__/nats-wrapper';


const createTicket: any = () => {
    return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
       title: "asdasd",
       price: 10
    });
};

it("returns a 404 if the provided id does not exist", async () => {
    const id: any = new mongoose.Types.ObjectId().toHexString();
    await request(app)
          .put(`/api/tickets/${id}`)
          .set("Cookie", global.signin())
          .send({
              ticket: "asdasd",
              price: 20
          })
          .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
    const id: any = new mongoose.Types.ObjectId().toHexString();
    await request(app)
          .put(`/api/tickets/${id}`)
          .send({
              ticket: "asdasd",
              price: 20
          })
          .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {

   const response: any = await request(app)
          .post(`/api/tickets`)
          .set("Cookie", global.signin())
          .send({
              ticket: "asdasd",
              price: 20
          });

          await request(app)
          .put(`/api/tickets/${response.body.id}`)
          .set("Cookie", global.signin())
          .send({
              ticket: "ddad",
              price: 24
          }).expect(401);

});

it("returns a 400 if the user provides an invalid title or price", async () => {
    const cookie: any = global.signin();
   const response: any = await request(app)
          .post(`/api/tickets`)
          .set("Cookie", cookie)
          .send({
              ticket: "asdasd",
              price: 20
          });

          await request(app)
          .put(`/api/tickets/${response.body.id}`)
          .set("Cookie", cookie)
          .send({
              ticket: "",
              price: 20
          }).expect(400);

          await request(app)
          .put(`/api/tickets/${response.body.id}`)
          .set("Cookie", cookie)
          .send({
              ticket: "asdasdasds",
              price: -10
          }).expect(400);



});

it("updates the ticket provided valid data", async () => {
    const cookie: any = global.signin();
    const response: any = await request(app)
           .post(`/api/tickets`)
           .set("Cookie", cookie)
           .send({
               ticket: "asdasd",
               price: 20
           });

           await request(app)
           .put(`/api/tickets/${response.body.id}`)
           .set("Cookie", cookie)
           .send({
               ticket: "new title",
               price: 40
           }).expect(200);

           
           const ticketResponse: any = await request(app)
           .get(`/api/tickets/${response.body.id}`)
           .send();

           expect(ticketResponse.body.title).toEqual("new title");
           expect(ticketResponse.body.price).toEqual(40);
 
});


it("published an Event", async () => {
    const cookie: any = global.signin();
    const response: any = await request(app)
           .post(`/api/tickets`)
           .set("Cookie", cookie)
           .send({
               ticket: "asdasd",
               price: 20
           });

           await request(app)
           .put(`/api/tickets/${response.body.id}`)
           .set("Cookie", cookie)
           .send({
               ticket: "new title",
               price: 40
           }).expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    
 });

 it("rejects updates if the ticket is reserved", async () => {
    const cookie: any = global.signin();
    const response: any = await request(app)
           .post(`/api/tickets`)
           .set("Cookie", cookie)
           .send({
               ticket: "asdasd",
               price: 20
           });

           const ticket: any = await Ticket.findById(response.body.id);
           ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
           await ticket!.save();

           await request(app)
           .put(`/api/tickets/${response.body.id}`)
           .set("Cookie", cookie)
           .send({
               ticket: "new title",
               price: 40
           }).expect(400);
 });
