import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

 interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

/* An interface that describes the properties
    that a User Document has */
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
    // extra props here
    createdAt: Date;
}

const ticketSchema: any = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc: any, ret: any): any {
            ret.id = ret._id;
            delete ret._id;
            // delete ret.password;
           // delete ret.__v;
        }
    }
});

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);


let Ticket: TicketModel;
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};


Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };