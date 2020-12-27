import * as express from "express";
import * as VisitsController from "../../controllers/Visits/visitsController";

import authenticateToken from "../../middlewares/authenticateToken.middlewares";

var Router = express.Router();
//Get available date
Router.post("/visits/date/:id", authenticateToken, VisitsController.getAvailableDate)

//Add new visit
Router.post("/visits/:id", authenticateToken, VisitsController.addVisit)

//Get user visits
Router.get("/visits", authenticateToken, VisitsController.getVisit)

//Get salon visits
Router.post("/mysalon/:id/visits", authenticateToken, VisitsController.getSalonVisit)

//Get salon history
//Router.get("/mysalon/:id/history", authenticateToken, VisitsController.getSalonHistory)

//Update visit status
Router.post("/visits/status/:id", authenticateToken, VisitsController.updateStatus)

export { Router as VisitsRoutes };
