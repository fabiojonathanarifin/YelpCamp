const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema is the model object data for the server(basically like blueprint/template)
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);
//this model is used in seeds/index.js to create seed data
//this model is also used in app.js to access/recreate/manipulate previous data from the client-side (using CRUD)