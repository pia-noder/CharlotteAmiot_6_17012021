const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique:true},
    password: { type: String, required: true}
})

//Appliquer le validator au schéma avant d'en faire un model
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);