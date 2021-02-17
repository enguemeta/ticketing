import express, {Request, Response, Router} from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { Ticket } from "../models/ticket";

import { validateRequest, BadRequestError, requiredAuth } from "@4b-wins/common";


const router: any = express.Router();

router.get("/api/tickets", requiredAuth,
       validateRequest,
   async(req: Request, res: Response) => {
      const tickets: any = await Ticket.find({
          orderId: undefined
      });
      res.send(tickets);
});

export {router as indexTicketRouter};