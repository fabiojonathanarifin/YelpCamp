const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

//schema is the model object data for the server(basically like blueprint/template)
const CampgroundSchema = new Schema({
  title: String,
  //multiple images
  images: [
    {
      url: String,
      filename: String,
    },
  ],
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
