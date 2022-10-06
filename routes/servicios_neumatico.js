const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    let json
    db.query("SELECT id_tipo_servicio, motivo_cambio, id_neumatico, km_vehiculo, km_recorrido, fecha, id_proveedor_servicio, comentario FROM servicio_neumatico", function(err, result){
        if (err) throw err
        json ={
            data: result
        }
        res.statusCode = 200
        res.send(json)
    })
})

router.get('/(:id)', (req, res) => {
    let json
    let id = req.params.id
    if(id.length === 0) {
        json = {
            data: undefined,
            error: "Introduzca el id"
        }
        res.statusCode = 400 
        res.send(json)
    }else{ 
        db.query("SELECT id_tipo_servicio, motivo_cambio, id_neumatico, km_vehiculo, km_recorrido, fecha, id_proveedor_servicio, comentario FROM servicio_neumatico WHERE id = " + id, function(err, result){
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
        id_tipo_servicio: req.body.id_tipo_servicio,
        motivo_cambio: req.body.motivo_cambio,
        id_neumatico: req.body.id_neumatico,
        km_vehiculo: req.body.km_vehiculo,
        km_recorrido: req.body.km_recorrido,
        fecha: req.body.fecha,
        id_proveedor_servicio: req.body.id_proveedor_servicio,
        comentario: req.body.comentario
    }
    if (data.id_tipo_servicio.length === 0 || data.motivo_cambio.length === 0 || data.id_neumatico.length === 0 || data.km_vehiculo.length === 0 || data.km_recorrido.length === 0 || data.fecha.length === 0 || data.id_proveedor_servicio.length === 0 || data.comentario.length === 0) {
        json = {
            data: undefined,
            error: "Introduzca los campos requeridos"
        }
        res.statusCode = 400 
        res.send(json)
    }else if(Object.keys(data).length == 0) {
        json = {
            data: undefined,
            error: "Introduzca los campos a modificar"
        }
        res.statusCode = 400 
        res.send(json)
    }else{
    db.query('INSERT INTO servicio_neumatico SET ?', data, function(err, result) {
            if (err) throw err
            json ={
                data: result
            }
            res.statusCode = 201
            res.send(json)
        })
    }
})


router.put('/(:id)', function(req, res, next) {
    let json
    let id = req.params.id
    let data = {
        id_tipo_servicio: req.body.id_tipo_servicio,
        motivo_cambio: req.body.motivo_cambio,
        id_neumatico: req.body.id_neumatico,
        km_vehiculo: req.body.km_vehiculo,
        km_recorrido: req.body.km_recorrido,
        fecha: req.body.fecha,
        id_proveedor_servicio: req.body.id_proveedor_servicio,
        comentario: req.body.comentario
    }
    // modifies "data" object deleting undefined fields.
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key])

    // modifies "data" object deleting undefined fields.
    if(id.length === 0) {
        json = {
            data: undefined,
            error: "Introduzca el id"
        }
        res.statusCode = 400 
        res.send(json)
    }else if(Object.keys(data).length == 0) {
        json = {
            data: undefined,
            error: "Introduzca los campos a modificar"
        }
        res.statusCode = 400 
        res.send(json)
    }else{
        db.query('UPDATE servicio_neumatico SET ? WHERE id = ' + id, data, function(err, result) {
            if (err) throw err
            json ={
                data: result
            }
            res.statusCode = 200
            res.send(json)
        })
    }
})

router.delete('/(:id)', function(req, res, next) {
    let json
    let id = req.params.id

    db.query('DELETE FROM servicio_neumatico WHERE id = ' + id, function(err, result) {
        if (err) throw err
        json ={
            data: result
        }
        res.statusCode = 200
        res.send(json)
    })
})

module.exports = router;