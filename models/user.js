const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim : true
    },
    email: {
        type : String,
        required : true,
        unique : true
    },
    password: {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 1024
    },
    isAdmin : Boolean 
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({ _id: this._id , isAdmin : this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema );

function validateUser(user) {
    const schema = {
        name: Joi.string().required(),
        email : Joi.string().required().email(),
        password : Joi.string().min(5).max(1024).required()
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;