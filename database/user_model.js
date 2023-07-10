const { Schema, default: mongoose } = require("mongoose");


const userSchema = new Schema({
    number: Number,
    email: String,
    fullName: String,
    userName: String,
    password: String,
    salt: String
})

module.exports = mongoose.model('user', userSchema);

