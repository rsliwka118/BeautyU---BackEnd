import * as express from "express";

import * as UserController from "../../controllers/authServer/userController";

var Router = express.Router();

//Get all users
Router.get("/users", UserController.usersGetAction);

//Get user by ID
Router.get("/users/:id", UserController.userGetByIdAction);

export { Router as UserRoutes };
