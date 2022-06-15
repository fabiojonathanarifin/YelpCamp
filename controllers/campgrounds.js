const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    //.find() is used to grab the data in the server and using it on the campgrounds/index
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400)
    // req.body.campground to grab the data, and put it into 'campground' variable
    const campground = new Campground(req.body.campground);
    //the multer upload.array function
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    //inputing user id to campground
    campground.author = req.user._id;
    //saving the new campground to the server
    await campground.save();
    console.log(campground)
    console.log(campground.images)
    req.flash('success', 'Successfull made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    //requesting the data using specific id
    const campground = await (await Campground.findById(req.params.id).populate({
        //populate reviews on campground
        path: 'reviews',
        //populate the author of each reviews
        populate: {
            path: 'author'
        }
        //separately populate author of campgrounds
    }).populate('author'));
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground.')
    res.redirect('/campgrounds')
}