const mongoose = require('mongoose')

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
  name: String,
  number: String
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