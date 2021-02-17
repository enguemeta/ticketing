import express, {Request, Response, Router} from "express";
import { body } from "express-validator";
import { Order, OrderStatus } from "../models/order";

import { validateRequest, BadRequestError, requiredAuth, NotFoundError, NotAuthorizedError } from "@4b-wins/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router: any = express.Router();

router.delete("/api/orders/:orderId", requiredAuth,
       validateRequest,
   async(req: Request, res: Response) => {
    const { orderId } = req.params;
     const order: any = await Order.findById(orderId).populate("ticket");
     if(!order) {
         throw new NotFoundError();
     }
     if(order.userId !== req.currentUser!.id) {
         throw new NotAuthorizedError();
     }
     order.status = OrderStatus.Cancelled;
     await order.save();

     new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id
        }
     });

     res.status(204).send(order);

});

export {router as deleteOrderRouter};