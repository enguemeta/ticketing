import { body } from "express-validator";

import  mongoose  from "mongoose";
import  request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from '../../__mocks__/nats-wrapper';
import { Order, OrderStatus } from "../models/order";


it("marks an order as cancelled", async () => {
      const ticket: any = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
       title: "concert",
       price: 20
    });
    await ticket.save();

    const user = global.signin();
      const { body: order } = await request(app)
           .post(`/api/orders`)
           .set("Cookie", user)
           .send({
             ticketId: ticket.id
           }).expect(201);

          await request(app)
           .delete(`/api/orders/${order.id}`)
           .set("Cookie", user)
           .send()
           .expect(204);  

       const { body: fetchOrder }  = await request(app)
          .get(`/api/orders`)
          .set("Cookie", user)
          .send({ticketId: ticket.id})
          .expect(201);

          expect(fetchOrder!.status).toEqual(OrderStatus.Cancelled);
  

});



it("published an Event", async () => {
  const ticket: any = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20
 });
 await ticket.save();

 const user = global.signin();
   const { body: order } = await request(app)
        .post(`/api/orders`)
        .set("Cookie", user)
        .send({
          ticketId: ticket.id
        }).expect(201);

       await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204);  

     await request(app)
       .get(`/api/orders`)
       .set("Cookie", user)
       .send({ticketId: ticket.id})
       .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    
 });
