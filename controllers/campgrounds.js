const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  //.find() is used to grab the data in the server and using it on the campgrounds/index
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400)
  // req.body.campground to grab the data, and put it into 'campground' variable
  const campground = new Campground(req.body.campground);
  //the multer upload.array function
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  //inputing user id to campground
  campground.author = req.user._id;
  //saving the new campground to the server
  await campground.save();
  req.flash("success", "Successfull made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  //requesting the data using specific id
  const campground = await await Campground.findById(req.params.id)
    .populate({
      //populate reviews on campground
      path: "reviews",
      //populate the author of each reviews
      populate: {
        path: "author",
      },
      //separately populate author of campgrounds
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  //we're pushing, not overriding
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  //We use spreads because map produce an array of array,
  //And we don't want to push array of array into the existing array of objects
  //Spreads is use so we push multiple seperated(spreaded) objects to the array instead of an array of objects
  //instead of this [{url:lorem, filename:lorem}, {url:lorem, filename:lorem}]
  //this {url:lorem, filename:lorem} then {url:lorem, filename:lorem} then {url:lorem, filename:lorem}
  campground.images.push(...imgs);
  await campground.save();
  //to delete selected images
  //$pull is to pull out element from an array
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      //delete files in the cloudinary
      await cloudinary.uploader.destroy(filename);
    }
    //delete files in mongodb
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground.");
  res.redirect("/campgrounds");
};
