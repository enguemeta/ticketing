import mongoose from "mongoose";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteEvent, OrderStatus } from "@4b-wins/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";

const setup = async() => {
    const listener: any = new ExpirationCompleteListener(natsWrapper.client);
    const ticket:any = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });

    await ticket.save();

    const order:any = Order.build({
        status: OrderStatus.Created,
        userId: "adasdsad",
        expiresAt: new Date(),
        ticket

    });
    await order.save();

    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id
    };

    //@ts-ignore
    const msg: Message = {
       ack: jest.fn()
    };

    return { listener, order, data, msg };

};

it("updates the order status to cancelled", async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder: any = await Order.findById(order.id);
    expect(updatedOrder!.title).toEqual(OrderStatus.Cancelled);

});

it("emit an OrderCancelled event", async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData: any = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});
