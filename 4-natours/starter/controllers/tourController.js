const Tour = require('./../models/tourModel')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.getAllTours = async (req, res) => {
  try {
    //build query
    //1) filtering
    const queryObj = { ...req.query }
    console.log(req.query)
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])

    //2 advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    console.log(JSON.parse(queryStr))
    let query = Tour.find(JSON.parse(queryStr))

    //sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      console.log(sortBy)
      query = query.sort(sortBy)
      //sort('price ratingsAverage')
    } else {
      query = query.sort('-createdAt')
    }

    //field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    //pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit
    //page=2&limit=10 1-10 page 1, 11-20 page 2
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const numTours = await Tour.countDocuments()
      if(skip >= numTours) throw new Error('This page does not exist.')
    }

    //execute query
    const tours = await query

    //send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }

}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    // Tour.findOne({ _id: req.params.id })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

exports.createTour = async (req, res) => {
  // const newTour = new Tour({})
  // newTour.save()

  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}