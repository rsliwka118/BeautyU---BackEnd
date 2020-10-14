import { validationResult } from 'express-validator';
 
export default async function UserInputMiddleware(req, res, next) 
{
    const errors = validationResult(req);

    if(errors.isEmpty())
    {
        return next();
    }
    else
    {
        return res.status(400).json({ errors: errors.array() });
    }
}