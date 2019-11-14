const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

//name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(el) {
        // this only works on CREATE and SAVE!
        return el === this.password
      },
      message: 'Passwords are not the same'
    }
  },
  passwordChangedAt: Date
})

userSchema.pre('save', async function(next) {
  // only run this function if password was modified
  if(!this.isModified('password')) return next()
  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)
  //delete the password confirm field
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if(this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    console.log(changedTimestamp, JWTTimestamp)
    return JWTTimestamp < changedTimestamp //100 < 200
  }

  // False means NOT changed
  return false
}

const User = mongoose.model('User', userSchema)

module.exports = User