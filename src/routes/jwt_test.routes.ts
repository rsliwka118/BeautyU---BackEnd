import * as express from "express";

import * as UserController from "../controllers/userController";
import authenticateToken from "../middlewares/authenticateToken.middlewares";

var Router = express.Router();
const test = [
    //Have to add table in DB with user ID
]
//JWT test
Router.get("/test", authenticateToken, (req, res) => {
    res.json()
});


export { Router as UserRoutes };
