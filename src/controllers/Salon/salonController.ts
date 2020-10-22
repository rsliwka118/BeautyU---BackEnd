import { createHmac } from "crypto";
import { getRepository } from "typeorm"
import { Salon } from "../../entity/Salon/Salon"
import { SalonLocation } from "../../entity/Salon/SalonLocation";
import { SalonReview } from "../../entity/Salon/SalonReview";
import { SalonService } from "../../entity/Salon/SalonService";
import { User } from "../../entity/User/User"

//Check type of user account
function checkAccountType(user) {
    if(user.accountType === "Client") return 0;
    if(user.accountType === "Salon") return 1;
}

//Check if parameter is equal null ( for update functions )
function checkEmpty(param, existingItem){
  if(param === "") return existingItem
  else return param
}

//Add new salon
export async function addSalon(req, res) {
    let RepositoryUsers = getRepository(User)
    let RepositorySalon = getRepository(Salon)
    let RepositorySalonLocation = getRepository(SalonLocation)
    
    const user = await RepositoryUsers.findOne(req.user.id)

    try {
      if (checkAccountType(user)) {

        //Add Location
        let NewLocation = new SalonLocation()
        NewLocation.city = req.body.city,
        NewLocation.code = req.body.code,
        NewLocation.street = req.body.street,
        NewLocation.houseNumber = req.body.houseNumber,
        NewLocation.apartmentNumber = req.body.apartmentNumber
        await RepositorySalonLocation.save(NewLocation)

        //Add Salon
        let NewSalon = new Salon()
        NewSalon.ownerID = user.id,
        NewSalon.name = req.body.name,
        NewSalon.type = req.body.type,
        NewSalon.describe = req.body.describe,
        NewSalon.hours = req.body.hours,
        NewSalon.location = NewLocation

        await RepositorySalon.save(NewSalon)
        console.dir(NewSalon)

        return res.status(200).send("Successfuly added new salon for " + user.firstName + "!")
    } else {
        return res.status(400).send("access denied ( route for salon account )")
      }
    } catch (Error) {
      console.error(Error)
      return res.status(500).send("server err")
    }
  }

//Update salon
export async function updateSalon(req, res) {
  let RepositoryUsers = getRepository(User)
  let RepositorySalon = getRepository(Salon)
  let RepositorySalonLocation = getRepository(SalonLocation)
  
  const user = await RepositoryUsers.findOne(req.user.id)
  const salon = await RepositorySalon.findOne(req.params.id)
  const location = await RepositorySalonLocation.findOne(salon.location)

  try {
    if (salon == null) return res.status(404).send("No salon found")
    if (checkAccountType(user)) {

      //Update Location
      await RepositorySalonLocation.update(location.id,
        {
          city: checkEmpty(req.body.city, location.city),
          code: checkEmpty(req.body.code, location.code),
          street: checkEmpty(req.body.street, location.street),
          houseNumber: checkEmpty(req.body.houseNumber, location.houseNumber),
          apartmentNumber: checkEmpty(req.body.apartmentNumber, location.houseNumber)
        })

      //Update Salon
      await RepositorySalon.update(req.params.id,
        {
          name: checkEmpty(req.body.name, salon.name),
          type: checkEmpty(req.body.type, salon.type),
          describe: checkEmpty(req.body.describe, salon.describe),
          hours: checkEmpty(req.body.hours, salon.hours)
        })

      return res.status(200).send("Successfuly updated salon for " + user.firstName + "!")
  } else {
      return res.status(400).send("access denied ( route for salon account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Delete salon
export async function deleteSalon(req, res) {

  let RepositoryUsers = getRepository(User)
  let RepositorySalon = getRepository(Salon)
  let RepositorySalonLocation = getRepository(SalonLocation)

  try {
    const user = await RepositoryUsers.findOne(req.user.id)
    const salon = await RepositorySalon.findOne(req.params.id)
    
    //Check if salon exist
    if (salon == null) return res.status(404).send("No salon found")

    //Check if owners password is correct
    if (user.password === createHmac("sha1", req.body.password).digest("hex")) {
      const location = await RepositorySalonLocation.findOne(salon.location)

      await RepositorySalon.delete(salon);
      await RepositorySalonLocation.delete(location);

      res.send("Successfully deleted salon " + salon.name +  "( id: "+ salon.id + ")")
      return res.status(204)
    } else {
      return res.status(401).send("The correct password is required to delete the salon")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Add new salon service
export async function addSalonService(req, res) {
  let RepositoryUsers = getRepository(User)
  let RepositorySalon = getRepository(Salon)
  let RepositorySalonService = getRepository(SalonService)
  
  const user = await RepositoryUsers.findOne(req.user.id)
  const salon = await RepositorySalon.findOne(req.params.id)
  try {
    if (salon == null) return res.status(404).send("No salon found")
    if (checkAccountType(user)) {

      //Add Service
      let NewService = new SalonService()
      NewService.offerTitle = req.body.offerTitle,
      NewService.time = req.body.time,
      NewService.price = req.body.price,
      NewService.salon = salon

      await RepositorySalonService.save(NewService)

      console.dir(NewService)

      return res.status(200).send("Successfuly added new service for " + salon.name + "!")
  } else {
      return res.status(400).send("access denied ( route for salon account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Update salon service
export async function updateSalonService(req, res) {
  let RepositoryUsers = getRepository(User)
  let RepositorySalonService = getRepository(SalonService)
  
  const user = await RepositoryUsers.findOne(req.user.id)
  const salonService = await RepositorySalonService.findOne(req.params.id)
  try {
    if (salonService == null) return res.status(404).send("No salon found")
    if (checkAccountType(user)) {

      //Update Service
      await RepositorySalonService.update(salonService.id,
        {
          offerTitle: checkEmpty(req.body.offerTitle, salonService.offerTitle),
          time: checkEmpty(req.body.time, salonService.time),
          price: checkEmpty(req.body.price, salonService.price),
          
        })

      return res.status(200).send("Successfuly update the service")
  } else {
      return res.status(400).send("access denied ( route for salon account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Delete salon service
export async function deleteSalonService(req, res) {

  let RepositoryUsers = getRepository(User)
  let RepositorySalonService = getRepository(SalonService)

  try {
    const user = await RepositoryUsers.findOne(req.user.id)
    const salonService = await RepositorySalonService.findOne(req.params.id)
    
    //Check if salon service exist
    if (salonService == null) return res.status(404).send("No salon found")
    if (checkAccountType(user)) {

      await RepositorySalonService.delete(salonService);

      res.send("Successfully deleted salon service " + salonService.offerTitle +  "( id: "+ salonService.id + ")")
      return res.status(204)
    } else {
      return res.status(401).send("access denied ( route for salon account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Add salon review ( for clients )
export async function addReview(req, res) {
  try {
    let RepositoryUsers = getRepository(User)
    let RepositorySalon = getRepository(Salon)
    let RepositorySalonReview = getRepository(SalonReview)
  
    const user = await RepositoryUsers.findOne(req.user.id)
    const salon = await RepositorySalon.findOne(req.params.id)

    if (salon == null) return res.status(404).send("No salon found")
    if (!checkAccountType(user)) {

      //Add Review
      let NewReview = new SalonReview()
      NewReview.userID = user.id,
      NewReview.review = req.body.review,
      NewReview.rate = req.body.rate,
      NewReview.salon = salon

      await RepositorySalonReview.save(NewReview)

      console.dir(NewReview)

      return res.status(200).send("Successfuly added new review for " + salon.name + " by " + user.firstName + "!")
  } else {
      return res.status(400).send("access denied ( route for client account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Get all reviews for salon

//Get review by ID

//Get all salons
export async function getSalons(req, res) {
  try {
    let RepositorySalon = getRepository(Salon)
    let RepositoryUsers = getRepository(User)

    const salons = await RepositorySalon.find()
    const user = await RepositoryUsers.findOne(req.user.id)

    if (!checkAccountType(user)) {
      return res.status(200).send(salons)
    } else {
     return res.status(400).send("access denied ( route for client account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Get salon by ID