import mongoose from "mongoose";
import { OrderCancelledListener } from "./../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent, OrderStatus, Subjects } from "@4b-wins/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";



const setup = async() => {
    const listener: any = new OrderCancelledListener(natsWrapper.client);
    const orderId: any = mongoose.Types.ObjectId().toHexString();
    const ticket: any  = Ticket.build({
        title: "concert",
        price: 99,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    ticket.set({orderId});
    await ticket.save();

    const data: OrderCancelledEvent["data"] = {

        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id
        }
      };

    //@ts-ignore
    const msg: Message = {
       ack: jest.fn()
    };

    return { listener, ticket, data, orderId, msg };

};


it("updates the ticket, publishes an event, and acks the message", async () => {
    const { listener, ticket, data, orderId, msg } = await setup();
    await listener.onMessage(data, msg);
    const ticketUpdated: any = await Ticket.findById(ticket.id);
    expect(ticketUpdated!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();

});