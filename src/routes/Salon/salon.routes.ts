import { check } from "express-validator";
import * as express from "express";

import * as SalonController from "../../controllers/Salon/salonController";
import authenticateToken from "../../middlewares/authenticateToken.middlewares";
import CheckInputMiddleware from "../../middlewares/input.middlewares";

var Router = express.Router();

//Add new salon
Router.post("/salon",
  [
    check("data.name", "Salon name must contain minimum 5 and maximum 50 characters").trim().isLength({ min: 5, max: 50 }),
    check("data.type", "Incorrect salon type. Must be Hairdresser, Barber, Massager, Beautician, Nails, Depilation")
    .isIn(['Hairdresser', 'Barber', 'Massager', 'Beautician', 'Nails', 'Depilation']),
    check("data.describe", "Salon describe can be up to 250 characters long").trim().isLength({ max: 250 }),
    check("data.hours", "Hours can not be empty").not().isEmpty(),
    check("data.city", "City can not be empty").not().isEmpty(),
    check("data.code", "Code can not be empty").not().isEmpty(),
    check("data.street", "Street can not be empty").not().isEmpty(),
    check("data.houseNumber", "Number can not be empty").not().isEmpty()

  ], 
  CheckInputMiddleware, authenticateToken, SalonController.addSalon)

//Update salon info
Router.post("/salon/:id/update/info",
  [
    check("data.name", "Salon name must contain minimum 5 and maximum 50 characters").trim().isLength({ min: 5, max: 50 }),
    check("data.type", "Incorrect salon type. Must be Hairdresser, Barber, Massager, Beautician, Nails, Depilation")
    .isIn(['Hairdresser', 'Barber', 'Massager', 'Beautician', 'Nails', 'Depilation']),
    check("data.describe", "Salon describe can be up to 250 characters long").trim().isLength({ max: 250 }),
    check("data.city", "City can not be empty").not().isEmpty(),
    check("data.code", "Code can not be empty").not().isEmpty(),
    check("data.street", "Street can not be empty").not().isEmpty(),
    check("data.houseNumber", "Number can not be empty").not().isEmpty()
  ],
  CheckInputMiddleware, authenticateToken, SalonController.updateSalonInfo)

//Update salon hours
Router.post("/salon/:id/update/hours",
  [
    check("data.hours", "Hours can not be empty").not().isEmpty()
  ],
  CheckInputMiddleware, authenticateToken, SalonController.updateSalonHours)

//Delete salon
Router.delete("/salons/:id", authenticateToken, SalonController.deleteSalon)

//Get all salons
Router.get("/salons",authenticateToken, SalonController.getSalons)

//Get previews (category)
Router.get("/previews/:type",authenticateToken, SalonController.getPreviews)

//Get salon by ID
Router.get("/salons/:id",authenticateToken, SalonController.getSalonByID)

//Get salon services
Router.get("/mysalon/:id/services",authenticateToken, SalonController.getSalonServices)

//Add new salon service
Router.post("/salonsservice/:id",
  [
    check("data.offerTitle", "Offer title name can contain minimum 5 and maximum 50 characters").trim().isLength({ min: 5, max: 50 }),
    check("data.time", "Time can not be empty").not().isEmpty(),
    check("data.price", "Price can not be empty").not().isEmpty(),
  ],
  CheckInputMiddleware, authenticateToken, SalonController.addSalonService)

//Update salon service
Router.post("/salonsservice/:id",
  [
    check("data.offerTitle", "Offer title name can contain minimum 5 and maximum 50 characters").trim().isLength({ min: 5, max: 50 }),
  ],
  CheckInputMiddleware, authenticateToken, SalonController.updateSalonService)

//Delete salon service
Router.delete("/salonsservice/:id", authenticateToken, SalonController.deleteSalonService)

//Add salon review
Router.post("/reviews/:id", authenticateToken, SalonController.addReview)

//Get all reviews for salon
Router.get("/reviews/:id", authenticateToken, SalonController.getReviews)

//Add rate for salon
Router.post("/rate/:id", authenticateToken, SalonController.addRate)

//Add fav salon
Router.post("/fav/:id", authenticateToken, SalonController.addFav)

//Remove fav salon
Router.delete("/fav/:user/:salon", authenticateToken, SalonController.deleteFav)

//Get fav salons
Router.post("/myfavs/:id", authenticateToken, SalonController.getFav)

//Search
Router.post("/search/:id", authenticateToken, SalonController.search)

//Get my salons
Router.get("/mysalons", authenticateToken, SalonController.getMySalon)

export { Router as SalonRoutes };