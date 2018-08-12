
module.exports= function (req,res,next){
    if(!req.user.isAdmin) return res.status(403).send('Access Denied .Only admin can access this route.');
    next();
}
