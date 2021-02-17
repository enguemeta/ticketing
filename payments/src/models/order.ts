import { OrderStatus } from "@4b-wins/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import mongoose from "mongoose";


export { OrderStatus };

interface OrderAttrs {
    id: string;
    userId: string;
    status: OrderStatus;
    version: number;
    price: number;
}

/* An interface that describes the properties
    that a Order Document has */
    interface OrderDoc extends mongoose.Document {
        userId: string;
        status: OrderStatus;
        version: number;
        price: number;
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
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
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
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status,
    });
};


Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };