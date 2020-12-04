import { validationResult } from 'express-validator'
 
export default async function CheckInputMiddleware(req, res, next) 
{
    const errors = validationResult(req)

    if(errors.isEmpty())
    {
        return next()
    }
    else
    {
        return res.status(401).json({ errors: errors.array() })
    }
}