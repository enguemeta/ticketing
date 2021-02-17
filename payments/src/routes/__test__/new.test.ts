import  request from "supertest";
import  mongoose  from "mongoose";
import { app } from "../../app";
import { Order } from "../../models/order";
import { natsWrapper } from "../../__mocks__/nats-wrapper";
import { stripe } from "../../stripe";
import { OrderStatus } from "@4b-wins/common";
import { Payment } from "../../models/payments";



//jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
   
   await request(app)
   .post("/api/payments")
   .set("Cookie", global.signin())
   .send({
      token : "adasds",
      orderId : mongoose.Types.ObjectId().toHexString(),
   })
   .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
   const order: any = Order.build({
       id: mongoose.Types.ObjectId().toHexString(),
       userId: mongoose.Types.ObjectId().toHexString(),
       version: 0,
       price: 20,
       status: OrderStatus.Created
   });
   await order.save();
   await request(app)
   .post("/api/payments")
   .set("Cookie", global.signin())
   .send({
      token : "adasds",
      orderId : order.id,
   }).expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
   const userId: any = mongoose.Types.ObjectId().toHexString();
   const order: any = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.Cancelled
  });
  await order.save();
  await request(app)
  .post("/api/payments")
  .set("Cookie", global.signin(userId))
  .send({
     token : "adasds",
     orderId : order.id,
  }).expect(400);
});

it("returns a 201 with valid inputs", async () => {
   const userId: any = mongoose.Types.ObjectId().toHexString();
   const price: number = Math.floor(Math.random() * 1000);
   const order: any = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price,
      status: OrderStatus.Created
  });
  await order.save();

  await request(app)
   .post("/api/payments")
   .set("Cookie", global.signin(userId))
   .send({
      token : "tok_visa",
      orderId : order.id,
   }).expect(201);
 
    const stripeCharges: any = await stripe.charges.list({ limit: 50 });
    const stripeCharge: any = stripeCharges.data.find((charge: any) => {
         return charge.amount === price * 100;
    });

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual("usd");

    const payment: any = await Payment.findOne({
       orderId: order.id,
        stripeId: stripeCharge!.id
    });

    expect(payment).not.toBeNull();
 
   // const chargeOptions: any = (stripe.charges.create as jest.Mock).mock.calls[0][0];
   // expect(chargeOptions.source).toEqual("tok_visa");
   // expect(chargeOptions.amount).toEqual(20 * 100);
   // expect(chargeOptions.currency).toEqual("usd");

});

