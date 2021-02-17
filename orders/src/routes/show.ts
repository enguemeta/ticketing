import express, {Request, Response, Router} from "express";
import { body } from "express-validator";
import { Order } from "../models/order";

import { validateRequest, BadRequestError, requiredAuth, NotFoundError, NotAuthorizedError } from "@4b-wins/common";


const router: any = express.Router();

router.get("/api/orders/:orderId", requiredAuth,
       validateRequest,
   async(req: Request, res: Response) => {
     const order: any = await Order.findById(req.params.orderId).populate("ticket");
     if(!order) {
         throw new NotFoundError();
     }
     if(order.userId !== req.currentUser!.id) {
         throw new NotAuthorizedError();
     }
     res.status(200).send(order);

});

export {router as showOrderRouter};