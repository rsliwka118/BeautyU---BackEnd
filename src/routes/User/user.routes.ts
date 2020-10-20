import * as express from "express";

import * as UserController from "../../controllers/User/userController";
import authenticateToken from "../../middlewares/authenticateToken.middlewares";

var Router = express.Router();

//Get all users
Router.get("/users", UserController.usersGetAction);

//Get user by ID
Router.get("/users/:id", UserController.userGetByIdAction);

//Dashboard ( token test )
Router.post("/dashboard", authenticateToken, UserController.tokenTest);

export { Router as UserRoutes };
