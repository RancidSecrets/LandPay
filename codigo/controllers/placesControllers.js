const Places = require("../models/places")
const Income = require("../models/Income");
const Expense = require("../models/Expense");



//C in CRUD
exports.createPlaceView=(req,res,next)=>{
  const options=["House", "Apartment", "Other"]
  const img = Places.photo
  res.render("properties/create",{options, img})
}

exports.placePost = async (req, res) => {
  const photo = req.file.url
  const owner = req.user._id
  const { name, rent, tennants, address, latitude, longitude, placeType } = req.body
  const newPlace = {
    name,
    rent,
    tennants,
    owner,
    photo,
    location: {
      address,
      coordinates: [longitude, latitude]
    },
    placeType
  }
  const { _id } = await Places.create(newPlace)
  res.redirect(`/places`)
}

//R in CRUD
exports.placesView = async (req,res)=>{
  const places = await Places.find({owner: req.user._id}).sort({createdAt:-1})
  const income = await Income.find({owner: req.user._id}).sort({ createdAt:-1})
  const expense = await Expense.find({owner: req.user._id}).sort({ createdAt: -1})
  let sumInex = [...income, ...expense].reduce((sum, movement) => {
    return sum += movement.amount
  }, 0)
  sumInex = sumInex.toString()
  const obj = {places, income, expense, sumInex}
  res.render("properties/places", obj)
}

exports.detailPlace=async(req,res)=>{
  const {id}=req.params;
  const place=await Places.findById(id)
  res.render("properties/detailed",place);
}


// U in CRUD
exports.detailPlacePost=async (req,res,next)=>{
  const photo = req.file.url
  const { name, rent, tennants,  address, latitude, longitude, placeType } = req.body
  const updatePlace = {
    name,
    rent,
    tennants,
    photo,
    location: {
      address,
      coordinates: [longitude, latitude]
    },
    placeType
  }
  await Places.findByIdAndUpdate(req.params.id, updatePlace);

  res.redirect("/places");
}


//D in CRUD
exports.deletePlace= async (req,res,next)=>{
await Places.findByIdAndDelete(req.params.id);
res.redirect("/places")
}
