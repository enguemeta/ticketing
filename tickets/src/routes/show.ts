import express, {Request, Response, Router} from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { Ticket } from "../models/ticket";

import { validateRequest, BadRequestError, requiredAuth, NotFoundError } from "@4b-wins/common";


const router: any = express.Router();

router.get("/api/tickets/:id", requiredAuth,
       validateRequest,
   async(req: Request, res: Response) => {
    const ticket: any = await Ticket.findById(req.params.id);
    if(!ticket) {
        throw new NotFoundError();
    }
    res.status(200).send(ticket);

});

export {router as showTicketRouter};