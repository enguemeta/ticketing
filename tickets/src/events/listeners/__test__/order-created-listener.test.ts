import mongoose from "mongoose";
import { OrderCreatedListener } from "./../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus, Subjects } from "@4b-wins/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";



const setup = async() => {
    const listener: any = new OrderCreatedListener(natsWrapper.client);
    const ticket: any  = Ticket.build({
        title: "concert",
        price: 99,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();

    const data: OrderCreatedEvent["data"] = {

        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: "adas",
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
      };

    //@ts-ignore
    const msg: Message = {
       ack: jest.fn()
    };

    return { listener, ticket, data, msg };

};

it("sets the userId of the ticket", async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const ticketUpdated: any = await Ticket.findById(ticket.id);
    expect(ticketUpdated).toBeDefined();
    expect(ticketUpdated!.orderId).toEqual(data.id);

});

it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});


it("published a ticket updated event", async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const ticketUpdated: any = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdated.orderId);

});