import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentuserRouter } from "./routes/currrent-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler, NotFoundError } from "@4b-wins/common";


const app: any = express();
app.set("trust proxy", true);
app.use(json());
app.use(
   cookieSession({
      signed: false,
      //secure: process.env.NODE_ENV !== "test"
      secure: false
   })
);

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", async (req: Request, res: Response) => {
   //  next(new NotFoundError());
     throw new NotFoundError();
  });

app.use(errorHandler);

export { app };