import { createHmac } from "crypto";
import { getRepository, getManager, Brackets } from "typeorm"
import { Salon } from "../../entity/Salon/Salon"
import { SalonFav } from "../../entity/Salon/SalonFav";
import { SalonLocation } from "../../entity/Salon/SalonLocation"
import { SalonRate } from "../../entity/Salon/SalonRate"
import { SalonReview } from "../../entity/Salon/SalonReview"
import { SalonService } from "../../entity/Salon/SalonService"
import { User } from "../../entity/User/User"
//Check type of user account
function checkAccountType(user) {
    if(user.accountType === "Client") return 0
    if(user.accountType === "Salon") return 1
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
    if (salon.ownerID != user.id) return res.status(403).send("You are not the owner of this salon")
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

//Get salons preview (category)
export async function getPreviews(req, res) {
  try {
    let RepositorySalon = getRepository(Salon)
    let RepositoryUsers = getRepository(User)
    let RepositoryFav = getRepository(SalonFav)

    //const salons = await RepositorySalon.find()
    const user = await RepositoryUsers.findOne(req.user.id)
    
    if (!checkAccountType(user)) {

      const salons = await getManager()
      .createQueryBuilder(Salon, 'salon')
      .select(['salon.id','salon.name'])
      .leftJoinAndMapOne('salon.location', SalonLocation, 'location', 'salon.locationID = location.id')
      .leftJoinAndMapMany("salon.rates", SalonRate, 'rate', 'salon.id = rate.salon')
      .where('salon.type = :type',{ type: req.params.type})
      .andWhere('location.city = :city', {city: user.city})
      .getMany()

      const favorites = await getManager()
      .createQueryBuilder(SalonFav, 'salonFav')
      .select('salonFav.salon')
      .where('salonFav.user = :id', {id: req.user.id})
      .getMany()
      
      return res.status(200).json({salons ,favorites})
    } else {
     return res.status(400).send("access denied ( route for client account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Get all salons
export async function getSalons(req, res) {
  try {
    let RepositorySalon = getRepository(Salon)
    let RepositoryUsers = getRepository(User)

    //const salons = await RepositorySalon.find()
    const user = await RepositoryUsers.findOne(req.user.id)

    if (!checkAccountType(user)) {

      const salons = await RepositorySalon
      .createQueryBuilder('salon')
      .leftJoinAndMapOne("salon.location", SalonLocation, 'location', 'salon.locationID = location.id')
      .innerJoinAndMapMany("salon.services", SalonService, 'service', 'salon.id = service.salon')
      .leftJoinAndMapMany("salon.rates", SalonRate, 'rate', 'salon.id = rate.salon')
      .getMany()

      return res.status(200).json({salons: salons})
    } else {
     return res.status(400).send("access denied ( route for client account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Get salon by ID
export async function getSalonByID(req, res) {
  try {
    let RepositorySalon = getRepository(Salon)
    let RepositorySalonService = getRepository(SalonService)
    let RepositoryUsers = getRepository(User)

    //const salon = await RepositorySalon.findOne(req.params.id)
    const user = await RepositoryUsers.findOne(req.user.id)

    if (!checkAccountType(user)) {

     // if (!salon) {
     //   res.status(404)
     //   res.end()
     //   return
     // }

      const salon = await RepositorySalon
      .createQueryBuilder('salon')
      .leftJoinAndMapOne("salon.location", SalonLocation, 'location', 'salon.locationID = location.id')
      //.innerJoinAndMapMany("salon.services", SalonService, 'service', 'salon.id = service.salon')
      .leftJoinAndMapMany("salon.rates", SalonRate, 'rate', 'salon.id = rate.salon')
      .where('salon.id = :salonId', { salonId: req.params.id })
      .getOne()

      const services = await RepositorySalonService
      .createQueryBuilder('services')
      .select('services')
      .where('salonId = :id', {id: req.params.id})
      .getMany()
    
      return res.status(200).send({salon, services})
    } else {
     return res.status(400).send("access denied ( route for client account )")
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
    if (salon.ownerID != user.id) return res.status(403).send("You are not the owner of this salon")
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
export async function getReviews(req, res) {
  try {
    let RepositorySalon = getRepository(Salon)
    let RepositorySalonReview = getRepository(SalonReview)
    let RepositorySalonRate = getRepository(SalonRate)

    const salon = await RepositorySalon.findOne(req.params.id)
  
    if (!salon) {
      res.status(404)
      res.end()
      return
    }

    const reviews = await RepositorySalonReview
    .createQueryBuilder('review')
    .innerJoinAndMapOne("review.rate", SalonRate, 'rate', 'review.salon = rate.salon and review.userID = rate.user.id')
    .getMany()

    return res.status(200).send(reviews)
    
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Add rate for salon
export async function addRate(req, res) {
  try {
    let RepositoryUsers = getRepository(User)
    let RepositorySalon = getRepository(Salon)
    let RepositorySalonRate = getRepository(SalonRate)
  
    const user = await RepositoryUsers.findOne(req.body.data.id)
    const salon = await RepositorySalon.findOne(req.params.id)
    const rateExists = await RepositorySalonRate.findOne({user: user, salon: salon})

    if (salon == null) return res.status(404).send("No salon found")
    if (!checkAccountType(user)) {
      //Check if rate for salon by user is already exist
      if(rateExists == null){
        //Add Rate
        let message = {message: "Dodano ocenę " + req.body.data.rate + "!"}
        let NewRate = new SalonRate()
        NewRate.rate = req.body.data.rate,
        NewRate.salon = salon,
        NewRate.user = user

        await RepositorySalonRate.save(NewRate)

        console.dir(NewRate)

        return res.status(200).send(message)
      } else {
        //Update Rate
        let message = {message: "Zmieniono ocenę na "+ req.body.data.rate + "!"}
        await RepositorySalonRate.update(rateExists.id, { rate: req.body.data.rate })
        return res.status(200).send(message)
      }
  } else {
      return res.status(400).send("access denied ( route for client account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Add favorite salon
export async function addFav(req, res) {
  try {
    let RepositoryUsers = getRepository(User)
    let RepositorySalon = getRepository(Salon)
    let RepositorySalonFav = getRepository(SalonFav)
  
    const user = await RepositoryUsers.findOne(req.params.id)
    const salon = await RepositorySalon.findOne(req.body.data.id)
    console.log(req.body.data.id)
    if (salon == null) return res.status(404).send("No salon found")
    if (!checkAccountType(user)) {
      //Add Fav
      let message = {message: "Dodano do ulubionych!"}
      let NewFav = new SalonFav()
      NewFav.salon = salon.id,
      NewFav.user = user.id

      await RepositorySalonFav.save(NewFav)

      console.dir(NewFav)

      return res.status(200).send(message)
     
  } else {
      return res.status(400).send("access denied ( route for client account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Remove salon from favorites
export async function deleteFav(req, res) {
  try {
    let RepositoryUsers = getRepository(User)
    let RepositorySalon = getRepository(Salon)
    let RepositorySalonFav = getRepository(SalonFav)
  
    const user = await RepositoryUsers.findOne(req.params.user)
    const salon = await RepositorySalon.findOne(req.params.salon)

    if (salon == null) return res.status(404).send("No salon found")
    if (!checkAccountType(user)) {
      //Add Fav
      let message = {message: "Usunięto z ulubionych."}
      const fav = await RepositorySalonFav.findOne({ where: { user: user.id, salon: salon.id } })

      await RepositorySalonFav.delete(fav);
      return res.status(200).send(message)
     
  } else {
      return res.status(400).send("access denied ( route for client account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Get fav salons
export async function getFav(req, res) {
  try {
    let RepositoryUsers = getRepository(User)
    let RepositorySalon = getRepository(Salon)
    let RepositorySalonFav = getRepository(SalonFav)
  
    const user = await RepositoryUsers.findOne(req.params.id)
    const favList = req.body.data.favList

    if ( user == null ) return res.status(404).send("No user found")
    if ( favList.length === 0) return res.status(404).send("No favs found")
    
    if (!checkAccountType(user)) {

      //Fav list
      const favorites = await getManager()
      .createQueryBuilder(Salon, 'salon')
      .select(['salon.id','salon.name'])
      .where('salon.id IN (:favs)',{ favs: favList })
      .leftJoinAndMapOne('salon.location', SalonLocation, 'location', 'salon.locationID = location.id')
      .leftJoinAndMapMany("salon.rates", SalonRate, 'rate', 'salon.id = rate.salon')
      .getMany()

      return res.status(200).send(favorites)
     
  } else {
      return res.status(400).send("access denied ( route for client account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }

}

//Search
export async function search(req, res) {

  try {
    let RepositoryUsers = getRepository(User)
    const user = await RepositoryUsers.findOne(req.params.id)
    
    let phrase = req.body.data.phrase
    
    const result = await getManager()
      .createQueryBuilder(Salon, 'salon')
      .select(['salon.id','salon.name'])
      .leftJoinAndMapOne('salon.location', SalonLocation, 'location', 'salon.locationID = location.id')
      .leftJoinAndMapMany("salon.rates", SalonRate, 'rate', 'salon.id = rate.salon')
      .where('location.city = :city', {city: user.city})
      .andWhere("name like :phrase", { phrase:`%${phrase}%`})
      .getMany()

    return res.status(200).send(result)
 
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }

}