import { getRepository } from "typeorm";
import {User} from "../entity/User";
import { createHmac } from "crypto";

export async function login(req, res)
{
    try
    {   
        let Repository = getRepository(User);

        const user = await Repository.findOne(
            { where:
                { email: req.body.email }
            }
        );

        if(user.password === createHmac('sha256', req.body.password).digest('hex'))
        {
            req.session.userID = user.id;
            res.send('login succes!');

            return res.status(200).send();
        }
        else
        {
            return res.status(401).send('login failed');
        }
    }

    catch(Error)
    {
        console.error(Error);
        return res.status(500).send(); 
    }
}

export async function logout(req, res)
{
    try
    {
        req.session.destroy();
        res.send("logout success!");
    }
    catch
    {
        console.error(Error);
        return res.status(500).send();
    }
}