import  mongoose  from "mongoose";
import  request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {

    const ticket: any = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });
    await ticket.save();

    const user = global.signin();
    const { body: order }  = await request(app)
          .get(`/api/orders`)
          .set("Cookie", user)
          .send({ticketId: ticket.id})
          .expect(201);

        const { body: fetchOrder }  = await request(app)
          .get(`/api/tickets/${order.ticketId}`)
          .set("Cookie", user)
          .send()
          .expect(200);

          expect(fetchOrder.id).toEqual(order.id);
   
});


it("returns an error if one user tries to fectch another users order", async () => {

    const ticket: any = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });
    await ticket.save();

    const user = global.signin();
    const { body: order }  = await request(app)
          .get(`/api/orders`)
          .set("Cookie", user)
          .send({ticketId: ticket.id})
          .expect(201);

         await request(app)
          .get(`/api/tickets/${order.ticketId}`)
          .set("Cookie", global.signin())
          .send()
          .expect(401);
   
});





