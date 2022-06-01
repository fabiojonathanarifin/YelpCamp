const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
})

//passport plugin will add password and username automatically on the model
UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', UserSchema);
module.exports = mongoose.model('User', UserSchema);