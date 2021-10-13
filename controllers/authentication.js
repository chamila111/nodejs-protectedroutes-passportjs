const User = require('../models/user');
const config = require('../config');
const jwt = require('jwt-simple');
function tokenForUser(user){
    const timestamp = new Date().getTime()
    return jwt.encode({sub:user.id,iat:timestamp},config.secret)
}
exports.signin = function(req,res,next){
    //user has already had their email and password
    //we just need to give them a token
    res.send({token:tokenForUser(req.user)})
}
exports.signup = function(req,res,next){
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password){
        res.status(422).send({error:'must provide email and password'})
    }
    User.findOne({email:email},function(error,existingUser){
        if(error){
            return next(error);
        }
        if(existingUser){
            res.status(422).send({error:'email is in use'})
        }
        const user = new User({email:email,password:password});
        user.save(function(error){
            if(error){
                return next(error);
            }
            res.send({token:tokenForUser(user)})
        })
    })
}