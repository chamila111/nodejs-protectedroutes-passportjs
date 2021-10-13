const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStraregy = require('passport-local')
const config = require('../config');
const User = require('../models/user');
//create local strategy
const localOptions = {usernameField:'email'}
const localLogin = new LocalStraregy(localOptions,function(email,password,done){
//verify email and password,call done with user
//if it is the correct email and password
//else done with false
User.findOne({email:email},function(err,user){
    if(err){return done(err);}
    if(!user){return done(null,false);}
    //compare password
    user.comparePassword(password,function(err,isMatch){
        if(err){return done(err);}
        if(!isMatch){return done(null,false);}
        return done(null,user);
    })
})
})
//setup options for jwt strategy
const jwtOptions = {
    jwtFromRequest:ExtractJwt.fromHeader('authorization'),
    secretOrKey:config.secret
};
//create Jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions,function(payload,done){
    //see if the uder id in the payload exist in our database
    //if it does call done with that user
    //otherwise call done without user object
    User.findById(payload.sub,function(err,user){
        if(err){
            return done(err,false);
        }
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    });
});
//tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);