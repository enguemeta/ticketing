import express, {Request, Response, Router} from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError, requiredAuth } from "@4b-wins/common";

import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router: any = express.Router();

router.post("/api/tickets", requiredAuth, [
   body("title").not().isEmpty().withMessage("Title is required"),
   body("price").isFloat({ gt: 0}).withMessage("Price must be provided and must be greater than 0")
   ],
       validateRequest,
   async(req: Request, res: Response) => {
   
    const { title, price } = req.body;
    const ticket: any = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });

    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        version: ticket.version,
        userId: ticket.userId,
        title: ticket.title,
        price: ticket.price
    });
    res.status(201).send(ticket);

});

export {router as createTicketRouter};