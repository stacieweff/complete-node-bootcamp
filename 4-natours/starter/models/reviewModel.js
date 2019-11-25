const mongoose = require('mongoose')

// review / rating / createdAt / ref to tour / ref to user

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'A review cannot be empty!']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour.']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user.']
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // })

  this.populate({
    path: 'user',
    select: 'name photo'
  })

  next()
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review