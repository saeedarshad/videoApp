const config = require('config');
const jwt = require('jsonwebtoken');

module.exports= function (req,res,next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access Denied .Route is protected.');

    try {
        const deceoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = deceoded;
        next();
    } catch (error) {
        res.status(400).send('InvalidToken');
    }  
}
