import mongoose from "mongoose";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus, Subjects } from "@4b-wins/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";



const setup = async() => {
    const listener: any = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: "adas",
        ticket: {
            id: "asadas",
            price: 10
        }
      };

    //@ts-ignore
    const msg: Message = {
       ack: jest.fn()
    };

    return { listener, data, msg };

};

it("it replicates the order info", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const order: any = await Order.findById(data.id);
    
    expect(order!.price).toEqual(data.ticket.price);

});

it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});


// it("published a ticket updated event", async () => {
//     const { listener, ticket, data, msg } = await setup();
//     await listener.onMessage(data, msg);
//     expect(natsWrapper.client.publish).toHaveBeenCalled();
//     const ticketUpdated: any = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
//     expect(data.id).toEqual(ticketUpdated.orderId);

// });