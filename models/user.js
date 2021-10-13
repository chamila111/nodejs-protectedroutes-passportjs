const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema;
//define our model
const userSchema = new Schema({
    email:{
        type:String,
        lowercase:true,
        unique:true
    },
    password:String
})
//on save hook encrypt password
userSchema.pre('save',function(next){
    const user = this;
    bcrypt.genSalt(10,function(error,salt){
        if(error){
            return next(error)
        }
    bcrypt.hash(user.password,salt,null,function(err,hash){
        if(err){
            return next(err)
        }
        user.password = hash
        next()
    })
    })
})
//compare passwords
userSchema.methods.comparePassword = function(candidatePassword,callback){
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err){return callback(err);}
        callback(null,isMatch)
    });
}


//create the model class
const modelClass = mongoose.model('user',userSchema);
//export model
module.exports = modelClass;