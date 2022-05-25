//this file randomize and create/refresh data in the server(mongodb - db.campgrounds.find()) everytime it's launched

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground')

//first time usage is to create yelp-camp app data in the server, the next usage is to connect to the yelp-camp database
mongoose.connect('mongodb://localhost:27017/yelp-camp').
    catch(error => handleError(error));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

//randomizer function for title mix&match
const sample = array => array[Math.floor(Math.random() * array.length)];
//create & randomize 50 data in mongodb server
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Recusandae aperiam nihil illum odio qui perspiciatis provident, consequatur nemo! Quidem fugit quibusdam minima amet quo quaerat mollitia numquam velit. Id, quasi!Lorem',
            price
        })
        await camp.save();
    }
}

//close the app right away
seedDB().then(() => {
    mongoose.connection.close()
});