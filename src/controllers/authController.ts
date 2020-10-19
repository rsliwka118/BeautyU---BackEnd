import { getRepository } from "typeorm"
import { User } from "../entity/User"
import { createHmac } from "crypto"
import * as jwt from "jsonwebtoken"
import { RefreshToken } from "../entity/RefreshToken"

//Register
export async function register(req, res) {
  let Repository = getRepository(User)

  let Exists = await Repository.findOne({ where: { email: req.body.email } })

  try {
    if (Exists == null) {
      let NewUser = new User()
      NewUser.accountType = req.body.accountType
      NewUser.firstName = req.body.firstName
      NewUser.lastName = req.body.lastName
      NewUser.email = req.body.email
      NewUser.password = req.body.password

      await Repository.save(NewUser)

      console.dir(NewUser)
      res.send("Register succes!")

      return res.status(200).send()
    } else {
      return res.status(400).send()
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Login
export async function login(req, res) {
  try {
    let RepositoryUser = getRepository(User)
    let RepositoryRefreshToken = getRepository(RefreshToken)

    const user = await RepositoryUser.findOne({ where: { email: req.body.email } })
    const tokenExists = await RepositoryRefreshToken.findOne({ where: { userID: user.id } })

    if (user.password === createHmac("sha1", req.body.password).digest("hex")) {
      
      const accessToken = generateToken(user)
      
      if (tokenExists == null) {
        const refreshToken = generateRefreshToken(user)

        let NewToken = new RefreshToken()
        NewToken.userID = user.id
        NewToken.refreshToken = refreshToken
        await RepositoryRefreshToken.save(NewToken)

        console.log("Successfully logged in ( user ID: " + user.id + " )")
        console.log("Successfully added refreshToken for user ID: " + user.id + " )")

        return res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken})
      
      } else {
      
      console.log("Successfully logged in ( user ID: " + user.id + " )")

      return res.status(200).send({ accessToken: accessToken, refreshToken: tokenExists.refreshToken})
      }

    } else {
      return res.status(401).send("login failed")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Logout
export async function logout(req, res) {

  let RepositoryRefreshToken = getRepository(RefreshToken)

  await RepositoryRefreshToken.delete({ refreshToken: req.body.token });
  return res.sendStatus(204)
}

//Get new access token
export async function refreshToken(req, res) {

  const refreshToken = req.body.token

  let RepositoryRefreshToken = getRepository(RefreshToken)
  let tokenExists = await RepositoryRefreshToken.findOne({ where: { refreshToken: refreshToken } })
  
    if (refreshToken == null) return res.sendStatus(401)
    if (tokenExists == null) return res.sendStatus(403)
    
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    
      //token no longer valid
      if (err) return res.sendStatus(403)
      
      const accessToken = generateToken({id: user.id})
      res.json({ accessToken: accessToken })
   })
}

//Generate Token
function generateToken(user) {
  return jwt.sign( {id: user.id} , process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" } )
}

//Generate Refresh Token
function generateRefreshToken(user) {
  return jwt.sign( {id: user.id}, process.env.JWT_REFRESH_SECRET )
}
