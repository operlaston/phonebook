require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
morgan.token('req-body', (req, res) => { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.estimatedDocumentCount().then(len => {
    const dateTime = new Date()
    response.send(`Phonebook has info for ${len} people<br>${dateTime}`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        next()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(res => {
      if (res) {
        response.status(204).end()
      }
      else {
        next()
      }
    })
    .catch(error => {
      next(error)
    })
})

const generateId = () => {
  const newId = Math.floor(Math.random() * 1000 + 1) 
  return newId
}

app.post('/api/persons', (request, response, next) => {  
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(newPerson => {
    response.json(newPerson)
  })
  .catch(error => {
    next(error)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndUpdate(request.params.id, request.body, {new: true})
    .then(newPerson => {
      response.json(newPerson)
    })
    .catch(error => next(error))
})

const resourceNotFound = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(resourceNotFound)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformed request'})
  }
  // console.log('malformed request: ', error)
  
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log('Server is now listening on port', PORT)
})