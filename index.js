"use strict"

require('dotenv').config()
const express = require("express")
const { v4: uuidv4 } = require('uuid');

const app = new express()
const PORT = process.env.PORT || 5000

const usuarios = [
    {id: 1, nombre: 'Cecilia'},
    {id: 2, nombre: 'Lucìa'},
    {id: 3, nombre: 'Samantha'},
]

// mètodo use, para montar middlewares. En este caso usè json(),
// porque voy a recibir una peticiòn post y necesito hacer un parse json de lo que me manden
app.use(express.json())

app.get("/", (req, res) => res.send("Hola desde express"))
app.get("/api/usuarios", (req, res) => res.json(["Grover", "Luis"]))
app.get("/api/usuarios/:id", (req, res) => {
    
    let usuario = usuarios.find(usuario => usuario.id === parseInt(req.params.id))
    
    if (!usuario) {
        res.status(404).send('Error 404: Not found...')
    } else {
        res.status(200).send('User founded: ' + usuario.id)
    }
    
})

app.post('/api/usuarios', (req, res) => {
    if (!req.body.nombre || req.body.nombre.length < 3) {
        //Bad request
        res.status(400).send('Debe ingresar un nombre vàlido mayor a 2 caràcteres...')
        return
    }
    const usuario = {
        id: uuidv4(),
        nombre: req.body.nombre
    }
    usuarios.push(usuario)
    res.json({"users": usuarios})
})

app.listen(PORT, () => console.log("PORT listening at", PORT))