const { StatusCodes } = require("http-status-codes");
const { Unathorized, BadRequest, CustomError } = require("../errors");
const user = require("../models/user");
const listing = require("../models/listing");
const { checkPermission } = require("../utils");

const getListing = async (req, res) => {
  const list = await listing.findOne({ _id: req.params.id });
  if (!list) {
    throw new BadRequest(`No listing found with id ${req.params.id}`);
  }
  res.status(200).json(list);
};
const createListing = async (req, res) => {
  const Listing = await listing.create(req.body);
  if (!listing) {
    throw new CustomError("Something went wrong");
  }
  return res.status(201).json(Listing);
};
const deleteListing = async (req, res) => {
  const list = await listing.findById(req.params.id);
  if (!list) {
    throw new BadRequest(`No listing found with id ${req.params.id}`);
  }
  checkPermission(req.user, list.userRef);
  await listing.findOneAndDelete({ _id: req.params.id });
  res.status(StatusCodes.OK).json({ msg: "Listing deleted" });
};
const updateListing = async (req, res) => {
  const list = await listing.findById(req.params.id);
  if (!list) {
    throw new BadRequest(`No listing found with id ${req.params.id}`);
  }
  checkPermission(req.user, list.userRef);
  const upListing = await listing.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(upListing);
};
const getListings = async (req, res) => {
  const {
    limit,
    startIndex,
    sort,
    order,
    type,
    search,
    offer,
    furnished,
    parking,
  } = req.query;
  const limitt = parseInt(limit) || 9;
  const startIndexx = parseInt(startIndex) || 0;
  let offerr = offer;
  if (offerr === undefined || offerr === 'false') {
    offerr = { $in: [false, true] };
  }
  let furnishedd = furnished;
  if (furnishedd === undefined || furnishedd === 'false') {
    furnishedd = { $in: [false, true] };
  }
  let parkingg = parking;
  if (parkingg === undefined || parkingg === 'false') {
    parkingg = { $in: [false, true] };
  }
  let typee = type;
  if (typee === undefined || typee === "all") {
    typee = { $in: ["sale", "rent"] };
  }
  const searchh = search || '';
  const sortt = sort || "createAt";
  const orderr = order || "desc";

  const list = await listing
    .find({
      name: { $regex: searchh, $options: 'i' },
      parking:parkingg,
      furnished:furnishedd,
      type:typee,
      offer:offerr,
    })
    .sort({ [sortt]: orderr })
    .limit(limitt)
    .skip(startIndexx);
  return res.status(StatusCodes.OK).json(list);
};
module.exports = {
  getListing,
  createListing,
  deleteListing,
  updateListing,
  getListings,
};
