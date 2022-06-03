"use strict"

require('dotenv').config()
const express = require("express")

const logger = require('./logger')

//validaciones con la libreria Join
const Joi = require('joi')
const { v4: uuidv4 } = require('uuid')

const app = new express()
const PORT = process.env.PORT || 5000

const usuarios = [
    { id: 1, nombre: 'Cecilia' },
    { id: 2, nombre: 'Lucìa' },
    { id: 3, nombre: 'Samantha' },
]

const existeUsuario = (id) => (usuarios.find(usuario => usuario.id == id))

const validarUsuario = (nom) => {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required(),
    })
    return (schema.validate({ nombre: nom }))
}

// mètodo use, para montar middlewares. En este caso usè json(),
// porque voy a recibir una peticiòn post y necesito hacer un parse json de lo que me manden
//acepta las peticiones del body en un formato json
app.use(express.json())

//acepta las peticiones del body enviadas por un form
app.use(express.urlencoded({ extended: true })) 

app.use(logger)

app.use((req, res, next) => {
    console.log('Autenticando...')
    next()
})

app.get("/", (req, res) => res.send("Hola desde express"))

app.get("/api/usuarios", (req, res) => res.json(usuarios))

app.get("/api/usuarios/:id", (req, res) => {

    let usuario = existeUsuario(req.params.id)

    if (!usuario) {
        return res.status(404).send('Error 404: Not found...')
    } else {
        return res.status(200).send('User founded: ' + usuario.id + ' ' + usuario.nombre)
    }

})

app.post('/api/usuarios', (req, res) => {

    const { error, value } = validarUsuario(req.body.nombre)

    if (!error) {

        const usuario = {
            id: uuidv4(),
            nombre: value.nombre
        }
        usuarios.push(usuario)
        return res.status(201).send(usuarios)

    } else {
        //Bad request
        return res.status(400).send(error.details[0].message)
    }

})

app.put('/api/usuarios/:id', (req, res) => {
    //Encontrar si existe el objeto usuario que voy a modificar
    // let usuario = usuarios.find(usuario => usuario.id === parseInt(req.params.id))
    let usuario = existeUsuario(req.params.id)

    if (!usuario) {
        return res.status(404).send('Error 404: Not found...')
    } else {
        //Validar que el dato que me recibo es correcto
        const { error, value } = validarUsuario(req.body.nombre)

        if (!error) {
            usuario.nombre = value.nombre
            return res.send(usuario)
        } else {
            //Bad request
            return res.status(400).send(error.details[0].message)
        }
    }
})

app.delete('/api/usuarios/:id', (req, res) => {
    
    let usuario = existeUsuario(req.params.id)
    if (!usuario) return res.status(404).send('El usuario no fue encontrado...')

    const index = usuarios.indexOf(usuario)
    usuarios.splice(index,  1)

    return res.send(usuario)
})

app.listen(PORT, () => console.log("PORT listening at", PORT))