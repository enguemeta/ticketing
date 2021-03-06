import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { createOrderRouter }  from "./routes/new";
import { showOrderRouter }  from "./routes/show";
import { indexOrderRouter }  from "./routes/index";
import { deleteOrderRouter }  from "./routes/delete";

import { errorHandler, NotFoundError, currentUser } from "@4b-wins/common";


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

app.use(currentUser);

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async (req: Request, res: Response) => {
     throw new NotFoundError();
  });

app.use(errorHandler);

export { app };