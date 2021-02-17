import express, {Request, Response, Router} from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { validateRequest, BadRequestError } from "@4b-wins/common";
import { Password } from "./../services/password";

const router: any = express.Router();

router.post("/api/users/signin", [
   body("email")
       .isEmail()
       .withMessage("Email must be valid"),
   body("password")
       .trim()
       .notEmpty()
       .withMessage("You must supply a password")
   ],
   validateRequest,
   async(req: Request, res: Response) => {
      let { email, password } = req.body;
      const existingUser: any = await User.findOne({email});
      if(!existingUser) {
         throw new BadRequestError("Invalid credentials");
     }
     const passwordMatch: any = await Password.compare(existingUser.password, password);
     if(!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }
     /* Genrate JWT */
     const userJwt: any = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
   }, process.env.JWT_KEY!);

   /* Store the JWT on session object */
   req.session = { jwt: userJwt };

   res.status(201).send(existingUser);

});

export {router as signinRouter};