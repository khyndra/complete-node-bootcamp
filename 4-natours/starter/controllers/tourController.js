const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //BUILD QUERY
    //1A) Filtering
    const { page, sort, limit, fields, ...queryObj } = req.query;

    //const queryObj = { ...req.query };
    // const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // excludeFields.forEach((el) => {
    //   delete queryObj[el];
    // });

    //1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    //gte, gt, lte, lt
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    //{ difficulty: 'easy', duration: {$gte: 5 }}
    //{ difficulty: 'easy', duration: { gte: '5' }} //cl (req.query)
    let query = Tour.find(JSON.parse(queryStr));

    //2) Sorting
    if (sort) {
      //127.0.0.1:3000/api/v1/tours?sort=-price,ratingsAverage
      const sortBy = sort.split(',').join(' ');
      //console.log(sort); //-price,ratingsAverage
      //console.log(sortBy); //-price ratingAverage
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt _id');
    }

    //3) Field Limiting (only shows information we want to show)
    if (fields) {
      query = query.select(fields.split(',').join(' '));
    } else {
      //When using minus (-) in the select method it will exclude the v
      query = query.select('-__v');
    }

    //4) Pagination
    const pageNum = +page || 1;
    const limitNum = +limit || 100;
    const skip = (pageNum - 1) * limit;
    //?page=2&limit=10, 1-10 page 1, 11-20 page 2,...
    //We need to skip 10 results to go to page 2
    query = query.skip(skip).limit(limitNum);

    if (page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    //EXECUTE QUERY
    const tours = await query;

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //returns the new document
      runValidators: true, //it stays with schema validators
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};
