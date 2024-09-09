
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
morgan.token('body', (req, res) => { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const dateTime = new Date(Date.now())
  response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <br/>
    <div>${dateTime}</div>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const newId = Math.floor(Math.random() * 1000 + 1) 
  return newId
}

app.post('/api/persons', (request, response) => {  
  const body = request.body
  let errorMessage = ''
  
  if (!body.name) {
    errorMessage = 'name missing'
  } else if (!body.number) {
    errorMessage = 'number missing'
  } else if (persons.find(person => person.name === body.name)){
    errorMessage = 'name already exists in phonebook'
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
    persons = persons.concat(person)
    return response.json(person)
  }
  response.status(400).json({
    error: errorMessage
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log('Server is now listening on port', PORT)
})