import { getRepository } from "typeorm"
import { User } from "../entity/User/User"

//Get all users
export async function usersGetAction(req, res) {
  try {
    let Repository = getRepository(User)
    const users = await Repository.find()

    return res.status(200).send(users)
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Get user by ID
export async function userGetByIdAction(req, res) {
  try {
    let Repository = getRepository(User)
    const user = await Repository.findOne(req.params.id)

    if (!user) {
      res.status(404)
      res.end()
      return
    }

    return res.status(200).send(user)
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Dashboard ( JWT test )
export async function tokenTest(req, res) {
  try {
    let Repository = getRepository(User)
    const user = await Repository.findOne(req.user.id)

    if (!user) {
      res.status(404)
      res.end()
      return
    }

    return res.status(200).send("Hello " + user.firstName + "!")
  } catch {
    return res.status(500).send("server err")
  }
}
