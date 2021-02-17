import mongoose from "mongoose";
import { OrderCancelledListener } from "./../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent, OrderStatus, Subjects } from "@4b-wins/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";



const setup = async() => {
    const listener: any = new OrderCancelledListener(natsWrapper.client);
    const order: any  = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 10
    });
    await order.save();

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: "asdasd"
        }
      };

    //@ts-ignore
    const msg: Message = {
       ack: jest.fn()
    };

    return { listener, order, data, msg };

};


it("updates the status of the order and acks the message", async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const orderUpdated: any = await Order.findById(order.id);
    expect(orderUpdated!.status).toEqual(OrderStatus.Cancelled);
    expect(msg.ack).toHaveBeenCalled();

});