import express, {Request, Response, Router} from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@4b-wins/common";
import { Password } from "../services/password";


const router: Router = express.Router();

router.post("/api/users/signup", [
    body("email")
        .isEmail()
        .withMessage("Email must be valid"),
    body("password")
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage("Password must be between 4 and 20 characters")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        let { email, password } = req.body;
        const existingUser: any  = await User.findOne({email});

        if(existingUser) {
            throw new BadRequestError("A user with this email already exists.");
        }
        const hashed: string = await Password.toHash(password);
        const user: any = User.build({email, password: hashed});
        await user.save();
        /* Genrate JWT */
        const userJwt: any = jwt.sign({
           id: user.id,
           email: user.email
        }, process.env.JWT_KEY!);

        /* Store the JWT on session object */
        req.session = { jwt: userJwt };

        res.status(201).send(user);
});

export {router as signupRouter};