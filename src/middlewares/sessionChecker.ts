export default async function sessionChecker(req, res, next) 
{
    if (req.session.userID != null)
    {
        res.redirect('/');
    } 
    else 
    {
        next();
    }  
}