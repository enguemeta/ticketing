import { OrderStatus } from "@4b-wins/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import mongoose from "mongoose";

import { TicketDoc } from "./ticket";


export { OrderStatus };

interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

/* An interface that describes the properties
    that a User Document has */
    interface OrderDoc extends mongoose.Document {
        userId: string;
        status: OrderStatus;
        expiresAt: Date;
        ticket: TicketDoc;
        version: number;
        // extra props here
       // createdAt: Date;
    }

 interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema: any = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
    }
}, {
    toJSON: {
        transform(doc: any, ret: any): any {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

let Order: OrderModel;
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};


Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };