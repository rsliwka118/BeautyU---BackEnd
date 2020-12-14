import * as express from "express";
import * as VisitsController from "../../controllers/Visits/visitsController";

import authenticateToken from "../../middlewares/authenticateToken.middlewares";

var Router = express.Router();
//Get available date
Router.post("/visits/date/:id", VisitsController.getAvailableDate)

//Add new visit
Router.post("/visits/:id", authenticateToken, VisitsController.addVisit)

export { Router as VisitsRoutes };
