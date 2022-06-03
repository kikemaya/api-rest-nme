"use strict"

require("dotenv").config()

const express = require("express")
const config = require("config")
const debug = require("debug")("app:inicio")
// const dbDebug = require("debug")("app:db").
// const logger = require("./logger").
const morgan = require("morgan")

const usuarios = require("./routes/usuarios")

const app = new express()
const PORT = process.env.PORT || 5000

//Mètodo use, para montar middlewares.
//Acepta las peticiones del body en un formato json.
app.use(express.json())

//Acepta las peticiones del body enviadas por un form.
app.use(express.urlencoded({ extended: true })) 

//Me permite publicar archivos estàticos.
app.use(express.static("public"))

//Accedo al enrutamiento de mis usuarios.
app.use("/api/v1/usuarios", usuarios)

//Configuracion de entornos.
console.log("Aplicaciòn: " + config.get("nombre"))
console.log("BD Server: " + config.get("configDB.host"))

//Uso de un middleware de 3ro. Morgan, usarlo en modo dev, para ver logs de peticiones HTTP.
if (app.get("env") === "development") {
    app.use(morgan("tiny"))
    // console.log("Morgan habilitado").
    debug("Morgan està habilitado")
}

//Trabajos con la db.
debug("Conectando con la db...")

app.get("/", (req, res) => res.send("Bienvenido a mi API(:"))

app.listen(PORT, () => console.log("PORT listening at", PORT))