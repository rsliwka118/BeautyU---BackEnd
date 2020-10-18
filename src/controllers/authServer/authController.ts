import { getRepository } from "typeorm";
import { User } from "../../entity/authServer/User";
import { createHmac } from "crypto";
import * as jwt from "jsonwebtoken";

//Register
export async function register(req, res) {
  let Repository = getRepository(User);

  let Exists = await Repository.findOne({ where: { email: req.body.email } });

  try {
    if (Exists == null) {
      let NewUser = new User();
      NewUser.accountType = req.body.accountType;
      NewUser.firstName = req.body.firstName;
      NewUser.lastName = req.body.lastName;
      NewUser.email = req.body.email;
      NewUser.password = req.body.password;

      await Repository.save(NewUser);

      console.dir(NewUser);
      res.send("Register succes!");

      return res.status(200).send();
    } else {
      return res.status(400).send();
    }
  } catch (Error) {
    console.error(Error);
    return res.status(500).send('server err');
  }
}

//Login
export async function login(req, res) {
  try {
    let Repository = getRepository(User);

    const user = await Repository.findOne({ where: { email: req.body.email } });

    if (user.password === createHmac("sha1", req.body.password).digest("hex")) {
      const accessToken = jwt.sign( JSON.parse(JSON.stringify(user)), process.env.JWT_ACCESS_SECRET, { expiresIn: 1200 }
      );

      console.log("Successfully logged in ( user ID: " + user.id + " )");

      return res.status(200).send({ accessToken });
    } else {
      return res.status(401).send("login failed");
    }
  } catch (Error) {
    console.error(Error);
    return res.status(500).send('server err');
  }
}

//Logout
export async function logout(req, res) {
  try {
    req.session.destroy();
    res.send("logout success!");
  } catch {
    console.error(Error);
    return res.status(500).send('server err');
  }
}

//Token auth test route
export async function test(req, res) {
  try{
  let Repository = getRepository(User);
  const user = await Repository.findOne(req.user.id);
  
  if (!user) {
    res.status(404);
    res.end();
    return;
  }

  return res.status(200).send('Hello ' + user.firstName + '!');
  }
  catch{
    return res.status(500).send('server err');
  }
}