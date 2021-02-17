import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import mongoose from "mongoose";


interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}

/* An interface that describes the properties
    that a Payment Document has */
    interface PaymentDoc extends mongoose.Document {
        orderId: string;
        stripeId: string;
        version: number;
        // extra props here
        // createdAt: Date;
    }

 interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema: any = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc: any, ret: any): any {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

paymentSchema.set("versionKey", "version");
paymentSchema.plugin(updateIfCurrentPlugin);

let Payment: PaymentModel;
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};


Payment = mongoose.model<PaymentDoc, PaymentModel>("Payment", paymentSchema);

export { Payment };