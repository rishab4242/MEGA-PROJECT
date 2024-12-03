const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = ((req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.saveRedirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create a listings!");
        return res.redirect("/login");
    }
    next();
});

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.saveRedirectUrl) {
        res.locals.redirectUrl = req.session.saveRedirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not owner of this listings!");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.ValidateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errmsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

module.exports.reviewAuthor = async (req, res, next) => {
    let { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not author of this review!");
        return res.redirect(`/listings/${id}`)
    }
    next();
}