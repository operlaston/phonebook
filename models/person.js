const mongoose = require('mongoose')

// can search using query fields not defined in the schema
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
mongoose.connect(url)
  .then(res => {
    console.log('successfully connected to mongodb')
  })
  .catch(error => {
    console.log('an error occured while connecting to mongodb: ', error)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^[0-9]{2,3}-[^-]+$/.test(v)
      },
      message: props => `${props.value} is not valid; phone numbers must have 2 parts separated by a dash where the first part is 2 or 3 integers` 
    },
    required: true
  }
})

personSchema.set('toJSON', 
  {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  }
)

module.exports = mongoose.model('Person', personSchema)