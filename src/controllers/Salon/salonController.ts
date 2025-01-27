import { createHmac } from "crypto";
import { getRepository, getManager, Brackets } from "typeorm"
import { Salon } from "../../entity/Salon/Salon"
import { SalonFav } from "../../entity/Salon/SalonFav";
import { SalonLocation } from "../../entity/Salon/SalonLocation"
import { SalonRate } from "../../entity/Salon/SalonRate"
import { SalonReview } from "../../entity/Salon/SalonReview"
import { SalonService } from "../../entity/Salon/SalonService"
import { User } from "../../entity/User/User"
import { Visit } from "../../entity/Visits/Visits";

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

        //Add Location
        let NewLocation = new SalonLocation()
        NewLocation.city = req.body.data.city,
        NewLocation.code = req.body.data.code,
        NewLocation.street = req.body.data.street,
        NewLocation.houseNumber = req.body.data.houseNumber,
        NewLocation.apartmentNumber = req.body.data.apartmentNumber
        await RepositorySalonLocation.save(NewLocation)

        //Add Salon
        let NewSalon = new Salon()
        NewSalon.ownerID = user.id,
        NewSalon.name = req.body.data.name,
        NewSalon.type = req.body.data.type,
        NewSalon.describe = req.body.data.describe,
        NewSalon.hours = req.body.data.hours,
        NewSalon.location = NewLocation

        await RepositorySalon.save(NewSalon)
        console.dir(NewSalon)

        return res.status(200).send({message: "Dodano salon!", id: NewSalon.id})

    } catch (Error) {
      console.error(Error)
      return res.status(500).send("server err")
    }
  }

//Update salon info
export async function updateSalonInfo(req, res) {
  let RepositoryUsers = getRepository(User)
  let RepositorySalon = getRepository(Salon)
  let RepositorySalonLocation = getRepository(SalonLocation)
  
  const user = await RepositoryUsers.findOne(req.user.id)
  const salon = await RepositorySalon.findOne(req.params.id)
  const location = await RepositorySalonLocation.findOne(salon.location)

  try {
    if (salon == null) return res.status(404).send("No salon found")
    if (salon.ownerID != user.id) return res.status(403).send("You are not the owner of this salon")
    
      //Update Location
      await RepositorySalonLocation.update(location.id,
        {
          city: checkEmpty(req.body.data.city, location.city),
          code: checkEmpty(req.body.data.code, location.code),
          street: checkEmpty(req.body.data.street, location.street),
          houseNumber: checkEmpty(req.body.data.houseNumber, location.houseNumber),
          apartmentNumber: checkEmpty(req.body.data.apartmentNumber, location.houseNumber)
        })

      //Update Salon
      await RepositorySalon.update(req.params.id,
        {
          name: checkEmpty(req.body.data.name, salon.name),
          type: checkEmpty(req.body.data.type, salon.type),
          describe: checkEmpty(req.body.data.describe, salon.describe)
        })

      return res.status(200).send({message: "Zaktualizowano informacje!"})
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Update salon hours
export async function updateSalonHours(req, res) {
  let RepositoryUsers = getRepository(User)
  let RepositorySalon = getRepository(Salon)
  
  const user = await RepositoryUsers.findOne(req.user.id)
  const salon = await RepositorySalon.findOne(req.params.id)

  try {
    if (salon == null) return res.status(404).send("No salon found")
    if (salon.ownerID != user.id) return res.status(403).send("You are not the owner of this salon")

      //Update Hours
      await RepositorySalon.update(req.params.id,
        {
          hours: checkEmpty(req.body.data.hours, salon.hours)
        })

      return res.status(200).send({message: "Zaktualizowano godziny!"})
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
    
      const salons = await getManager()
      .createQueryBuilder(Salon, 'salon')
      .select(['salon.id','salon.name'])
      .leftJoinAndMapOne('salon.location', SalonLocation, 'location', 'salon.locationID = location.id')
      .leftJoinAndMapMany("salon.rates", SalonRate, 'rate', 'salon.id = rate.salon')
      .where('salon.type = :type',{ type: req.params.type})
      .andWhere('location.city = :city', {city: user.city})
      .andWhere('salon.ownerID != :id', {id: user.id})
      .getMany()

      const favorites = await getManager()
      .createQueryBuilder(SalonFav, 'salonFav')
      .select('salonFav.salon')
      .where('salonFav.user = :id', {id: req.user.id})
      .getMany()
      
      return res.status(200).json({salons ,favorites})

  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Get my salons preview
export async function getMySalon(req, res) {
  try {
    let RepositorySalon = getRepository(Salon)
    let RepositoryUsers = getRepository(User)

    //const salons = await RepositorySalon.find()
    const user = await RepositoryUsers.findOne(req.user.id)

    
      const salons = await getManager()
      .createQueryBuilder(Salon, 'salon')
      // .leftJoin(Visit, 'visits', 'salon.id = visits.salonID')
      .where('salon.ownerID = :id', {id: user.id})
      // .andWhere('visits.status = "Scheduled"')
      .select(['salon.id','salon.name','salon.type'])
      // .addSelect('COUNT(DISTINCT(visits.id)) as visits')
      .getMany()
      
      return res.status(200).json(salons)

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

      const salons = await RepositorySalon
      .createQueryBuilder('salon')
      .leftJoinAndMapOne("salon.location", SalonLocation, 'location', 'salon.locationID = location.id')
      .innerJoinAndMapMany("salon.services", SalonService, 'service', 'salon.id = service.salon')
      .leftJoinAndMapMany("salon.rates", SalonRate, 'rate', 'salon.id = rate.salon')
      .getMany()

      return res.status(200).json({salons: salons})

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
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

export async function getSalonServices(req, res) {
  try {
    let RepositorySalon = getRepository(Salon)
    let RepositorySalonService = getRepository(SalonService)
    let RepositoryUsers = getRepository(User)

    const user = await RepositoryUsers.findOne(req.user.id)
    const salon = await RepositorySalon.findOne(req.params.id)

      if( user.id !== salon.ownerID) return res.status(401).send("Route for salon owner")

      const services = await RepositorySalonService
      .createQueryBuilder('services')
      .select('services')
      .where('salonId = :id', {id: req.params.id})
      .getMany()
    
      return res.status(200).send(services)
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

      //Add Service
      let NewService = new SalonService()
      NewService.offerTitle = req.body.data.offerTitle,
      NewService.time = req.body.data.time,
      NewService.price = req.body.data.price,
      NewService.salon = salon

      await RepositorySalonService.save(NewService)

      console.dir(NewService)

      return res.status(200).send({message: "Dodano usługę!"})
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

      //Update Service
      await RepositorySalonService.update(salonService.id,
        {
          offerTitle: checkEmpty(req.body.offerTitle, salonService.offerTitle),
          time: checkEmpty(req.body.time, salonService.time),
          price: checkEmpty(req.body.price, salonService.price),
          
        })

      return res.status(200).send("Successfuly update the service")

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
   
      await RepositorySalonService.delete(salonService);

      res.send({message: "Usługa została usunięta"})
      return res.status(204)
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
  
      //Add Review
      let NewReview = new SalonReview()
      NewReview.userID = user.id,
      NewReview.review = req.body.review,
      NewReview.salon = salon

      await RepositorySalonReview.save(NewReview)

      console.dir(NewReview)

      return res.status(200).send("Successfuly added new review for " + salon.name + " by " + user.firstName + "!")
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
   
      //Add Fav
      let message = {message: "Dodano do ulubionych!"}
      let NewFav = new SalonFav()
      NewFav.salon = salon.id,
      NewFav.user = user.id

      await RepositorySalonFav.save(NewFav)

      console.dir(NewFav)

      return res.status(200).send(message)
     
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
    
    //Fav list
    const favorites = await getManager()
    .createQueryBuilder(Salon, 'salon')
    .select(['salon.id','salon.name'])
    .where('salon.id IN (:favs)',{ favs: favList })
    .leftJoinAndMapOne('salon.location', SalonLocation, 'location', 'salon.locationID = location.id')
    .leftJoinAndMapMany("salon.rates", SalonRate, 'rate', 'salon.id = rate.salon')
    .getMany()

    return res.status(200).send(favorites)

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
      .andWhere('salon.ownerID != :id', {id: user.id})
      .getMany()

    return res.status(200).send(result)
 
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }

}