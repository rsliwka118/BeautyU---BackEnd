import { check } from "express-validator";
import * as express from "express";

import * as SalonController from "../../controllers/Salon/salonController";
import authenticateToken from "../../middlewares/authenticateToken.middlewares";
import CheckInputMiddleware from "../../middlewares/input.middlewares";

var Router = express.Router();

//Add new salon
Router.post("/salon",
  [
    check("name", "Salon name must contain minimum 5 and maximum 50 characters").trim().isLength({ min: 5, max: 50 }),
    check("type", "Incorrect salon type. Must be Hairdresser, Barber, Massager, Beautician, Nails, Depilation")
    .isIn(['Hairdresser', 'Barber', 'Massager', 'Beautician', 'Nails', 'Depilation']),
    check("describe", "Salon describe can be up to 250 characters long").trim().isLength({ max: 250 }),
    check("hours", "Hours can not be empty").not().isEmpty(),
    check("city", "City can not be empty").not().isEmpty(),
    check("code", "Code can not be empty").not().isEmpty(),
    check("street", "Street can not be empty").not().isEmpty(),
    check("houseNumber", "Number can not be empty").not().isEmpty(),

  ], 
  CheckInputMiddleware, authenticateToken, SalonController.addSalon)

//Update salon
Router.put("/salon/:id",
  [
    check("name", "Salon name can contain maximum 50 characters").trim().isLength({ max: 50 }),
    check("type", "Incorrect salon type. Must be Hairdresser, Barber, Massager, Beautician, Nails, Depilation")
    .isIn(['Hairdresser', 'Barber', 'Massager', 'Beautician', 'Nails', 'Depilation']),
    check("describe", "Salon describe can be up to 250 characters long").trim().isLength({ max: 250 }),
  ],
  CheckInputMiddleware, authenticateToken, SalonController.updateSalon)

//Delete salon
Router.delete("/salons/:id", authenticateToken, SalonController.deleteSalon)

//Add new salon service
Router.post("/salonsservice/:id",
  [
    check("offerTitle", "Offer title name can contain minimum 5 and maximum 50 characters").trim().isLength({ min: 5, max: 50 }),
    check("time", "Time can not be empty").not().isEmpty(),
    check("price", "Price can not be empty").not().isEmpty(),
  ],
  CheckInputMiddleware, authenticateToken, SalonController.addSalonService)

//Update salon service
Router.put("/salonsservice/:id",
  [
    check("offerTitle", "Offer title name can contain minimum 5 and maximum 50 characters").trim().isLength({ min: 5, max: 50 }),
  ],
  CheckInputMiddleware, authenticateToken, SalonController.updateSalonService)

//Delete salon service
Router.delete("/salonsservice/:id", authenticateToken, SalonController.deleteSalonService)

//Get all salons
Router.get("/salons",authenticateToken, SalonController.getSalons)

//Get salon by ID
Router.get("/salons/:id",authenticateToken, SalonController.getSalonByID)

//Add salon review
Router.post("/reviews/:id", authenticateToken, SalonController.addReview)

//Get all reviews for salon

//Get review by ID

export { Router as SalonRoutes };