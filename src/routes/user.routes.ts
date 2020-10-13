import * as express from "express";

import * as UserController from "../controllers/userController";


var Router = express.Router();

Router.get('/users', UserController.usersGetAction);

Router.get('/users/:id', UserController.userGetByIdAction);

export {Router as UserRoutes};