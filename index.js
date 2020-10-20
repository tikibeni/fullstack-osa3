const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
morgan.token('person', (req, res) => {
    return JSON.stringify(req.body)
})

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-23-6423122'
    }
]

// Yleisinfojen hakeminen
app.get('/info', (req, res) => {
    const pvm = new Date()

    res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${pvm}</p>`)
})

// Palvelimen puhelinluettelon haku
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// Yksittäisen henkilön yhteystiedon haku (json)
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

// Yksittäisen yhteystiedon poisto
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

// Random ID-generaattori yhteystiedoille
const generateId = () => {
    return Math.floor(Math.random() * Math.floor(10000))
}

// Morganin konfigurointi juuri ennen POST-metodia, jotta se näyttää POST-pyynnön sisällön
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

// Yhteystiedon lisääminen
app.post('/api/persons', (req, res) => {    
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'missing content'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return res.status(409).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})