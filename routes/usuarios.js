const express = require("express")
const router = express.Router()

//validaciones con la libreria Join
const Joi = require('joi')
const { v4: uuidv4 } = require('uuid')

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

router.get("/", (req, res) => res.json(usuarios))

router.get("/:id", (req, res) => {

    let usuario = existeUsuario(req.params.id)

    if (!usuario) {
        return res.status(404).send('Error 404: Not found...')
    } else {
        return res.status(200).send('User founded: ' + usuario.id + ' ' + usuario.nombre)
    }

})

router.post('/', (req, res) => {

    const { error, value } = validarUsuario(req.body.nombre)

    if (!error) {

        const usuario = {
            id: uuidv4(),
            nombre: value.nombre
        }
        usuarios.push(usuario)
        return res.status(201).send(usuarios)

    } else {
        return res.status(400).send(error.details[0].message)
    }

})

router.put('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id)

    if (!usuario) {
        return res.status(404).send('Error 404: Not found...')
    } else {
        
        const { error, value } = validarUsuario(req.body.nombre)

        if (!error) {
            usuario.nombre = value.nombre
            return res.send(usuario)
        } else {
            return res.status(400).send(error.details[0].message)
        }
    }
})

router.delete('/:id', (req, res) => {
    
    let usuario = existeUsuario(req.params.id)
    if (!usuario) return res.status(404).send('El usuario no fue encontrado...')

    const index = usuarios.indexOf(usuario)
    usuarios.splice(index, 1)

    return res.send(usuario)
})

module.exports = router