import { getRepository } from "typeorm"
import { Salon } from "../../entity/Salon/Salon"
import { User } from "../../entity/User/User"

function checkAccountType(user) {
    if(user.accountType === "Client") return 0;
    if(user.accountType === "Salon") return 1;
}

export async function addSalon(req, res) {
    let RepositoryUsers = getRepository(User)
    let RepositorySalons = getRepository(Salon)
    
    const user = await RepositoryUsers.findOne(req.user.id)

    try {
      if (checkAccountType(user)) {
        return res.status(200).send("user "+ user.firstName + " account: "+user.accountType)
      } else {
        return res.status(400).send("you don't have permission")
      }
    } catch (Error) {
      console.error(Error)
      return res.status(500).send("server err")
    }
  }