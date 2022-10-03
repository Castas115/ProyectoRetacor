const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    let json
    db.query("SELECT id, id vehiculo, posicion, mm, presion FROM neumatico", function(err, result){
        if (err) throw err
        json ={
            data: result
        }
        res.statusCode = 200
        res.send(json)
    })
})

// TODO: queda por terminar
router.get('/(:id)', (req, res) => {
    let id = req.params.id
    let json
    if(id.length === 0) {
        json = {
            data: undefined,
            error: "Introduzca el id"
        }
        res.statusCode = 400 
        res.send(json)
    }else{ 
        db.query("SELECT id, id vehiculo, posicion, mm, presion FROM neumatico WHERE id = " + id , function(err, result){
            if (err) throw err
            json ={
                data: result
            }
            res.statusCode = 200
            res.send(json)
        })
    }
})

router.post('/', function(req, res, next) {
    let json
    let data = {
        id_vehiculo: req.body.id_vehiculo,
        posicion: req.body.posicion,
        mm: req.body.mm,
        presion: req.body.presion,
        id_tipo_neumatico: req.body.id_tipo_neumatico
    }
    if (data.id_vehiculo.length === 0 && data.posicion.length === 0 && data.mm.length === 0 && data.presion.length === 0 && data.id_tipo_neumatico
    .length === 0) {
        json = {
            data: undefined,
            error: "Introduzca los campos requeridos"
        }
        res.statusCode = 400 
        res.send(json)
    }else if(JSON.stringify(data).length <= 1) {
        json = {
            data: undefined,
            error: "Introduzca los campos a modificar"
        }
        res.statusCode = 400 
        res.send(json)
    }else{
        db.query('INSERT INTO neumatico SET ?', data, function(err, result) {
            if (err) throw err
            json ={
                data: result
            }
            res.statusCode = 200
            res.send(json)
        })
    }
})

router.put('/(:id)', function(req, res, next) {
    let id = req.params.id
    let data = {
        id_vehiculo: req.body.id_vehiculo,
        posicion: req.body.posicion,
        mm: req.body.mm,
        presion: req.body.presion,
        id_tipo_neumatico: req.body.id_tipo_neumatico
    }
    // modifies "data" object deleting undefined fields.
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key])

    if(id.length === 0) {
        json = {
            data: undefined,
            error: "Introduzca el id"
        }
        res.statusCode = 400 
        res.send(json)
    }else if(JSON.stringify(data).length <= 1) {
        json = {
            data: undefined,
            error: "Introduzca los campos a modificar"
        }
        res.statusCode = 400 
        res.send(json)
    }else{
        db.query('UPDATE neumatico SET ? WHERE id = ' + id, data, function(err, result) {
            if (err) throw err
            json = {
                data: result
            }
            res.statusCode = 200
            res.send(json)
        })
    }
})

router.delete('/(:id)', function(req, res, next) {
    let id = req.params.id

    db.query('DELETE FROM neumatico WHERE id = ' + id, function(err, result) {
        if (err) throw err
        json = {
            data: result
        }
        res.statusCode = 200
        res.send(json)
    })
})

module.exports = router;