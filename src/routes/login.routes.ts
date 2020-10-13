import * as express from "express";

import * as LoginController from "../controllers/loginController";
import sessionChecker from "../middlewares/sessionChecker";

var Router = express.Router();

Router.post('/login', sessionChecker, LoginController.login);
Router.post('/logout', LoginController.logout);

export {Router as LoginRoutes};
