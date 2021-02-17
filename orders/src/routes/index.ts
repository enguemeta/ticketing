import express, {Request, Response, Router} from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { Order } from "../models/order";

import { validateRequest, BadRequestError, requiredAuth } from "@4b-wins/common";


const router: any = express.Router();

router.get("/api/orders", requiredAuth,
       validateRequest,
   async(req: Request, res: Response) => {

       const orders = await Order.find({
           userId: req.currentUser!.id,           
       }).populate("ticket");

       res.send(orders);
});

export {router as indexOrderRouter};