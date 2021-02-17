import mongoose from "mongoose";
import { TicketUpdatedListener } from "./../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@4b-wins/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";



const setup = async() => {
    const listener: any = new TicketUpdatedListener(natsWrapper.client);
    const ticket:any = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "concert",
      price: 10,
    });

    await ticket.save();

    const data: TicketUpdatedEvent["data"] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: "new concert",
        price: 99,
        userId: new mongoose.Types.ObjectId().toHexString()
      };

    //@ts-ignore
    const msg: Message = {
       ack: jest.fn()
    };

    return { listener, ticket, data, msg };

};

it("finds, updates and saves a ticket", async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket: any = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);

});

it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
    const { listener, ticket, data, msg } = await setup();
    data.version = 10;
    try {
        await listener.onMessage(data, msg);
    } catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();
});