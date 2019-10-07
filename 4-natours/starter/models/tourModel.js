const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal than 40 characters'],
    minlength: [10, 'A tour name must have 10 or more characters.'],
    // validate: [validator.isAlpha, 'Tour name must only contain characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'a tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
      // this only points to current doc on NEW document creation
      return val < this.price
      },
      message: 'Discount price ({VALUE}) should be below regular price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

toursSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7
})

//Document Middleware: runs before .save() and .create() 
toursSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true})
  next()
})

// toursSchema.pre('save', function(next) {
//   console.log('Will save document...')
//   next()
// })

// toursSchema.post('save', function(doc, next) {
//   console.log(doc)
//   next()
// })

//QUERY MIDDLEWARE
toursSchema.pre(/^find/, function(next) {
  this.find({ secretTour: {$ne: true }})

  this.start = Date.now()
  next()
})

toursSchema.post(/^find/, function(docs, next) {
  console.log(`Query tooks ${Date.now() - this.start} milliseconds!`)
  next()
})

// AGGREGATION MIDDLEWARE
toursSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({$match: { secretTour: { $ne: true } } })
  console.log(this.pipeline())
  next()
})

const Tour = mongoose.model('Tour', toursSchema)

module.exports = Tour