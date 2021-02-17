import express, {Request, Response} from "express";

import { currentUser } from "@4b-wins/common";

const router:any = express.Router();

router.get("/api/users/currentuser", currentUser, (req: Request, res: Response) => {
      res.send({currentUser: req.currentUser || null});
});

export {router as currentuserRouter};