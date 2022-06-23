const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// https://res.cloudinary.com/demo/image/upload/c_fill,h_300,w_250/e_blur:300/sample.jpg

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

//adding thumbnail into the ImageSchema as a key value after manipulating the url value, putting it to the thumbnail value
//w_200 is setting the thumbnail width to 200 pixel - cloudinary docs
//image transforamtion api from cloudinary would be nice!
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
//schema is the model object data for the server(basically like blueprint/template)
const CampgroundSchema = new Schema({
  title: String,
  //multiple images
  images: [ImageSchema],
  //standard geolocation model schema from mongoose
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// mongoose middleware, it will be engaged when a campground is deleted
//the .post is not CRUD POST, it's pre vs post... means that the findOneAndDelete middleware will run after/post the campground deletion
//the findOneAndDelete is the action that would trigger the async function
// ---------- if something is deleted(findOneAndDelete is triggered by findByIdAndDelete), the async function will run
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    //this means that we will delete all reviews their id field is in the doc and its reviews array
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
//this model is used in seeds/index.js to create seed data
//this model is also used in app.js to access/recreate/manipulate previous data from the client-side (using CRUD)
