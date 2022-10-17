const express = require('express')
const router = express.Router()
const db = require('../lib/db')
const utils = require('../lib/vehiculos_utils')

router.get('/', (req, res) => {
    let json
    db.query("SELECT matricula FROM vehiculo", function(err, result){
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
        db.query("SELECT * FROM vehiculo WHERE id = " + id, function(err, result){
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
    let data = req.body
    
    if(!Object.hasOwnProperty.bind(data)('matricula') && !Object.hasOwnProperty.bind(data)('clase_vehiculo') && !Object.hasOwnProperty.bind(data)('tipo_vehiculo') && !Object.hasOwnProperty.bind(data)('km') && !Object.hasOwnProperty.bind(data)('id_base') &&  !Object.hasOwnProperty.bind(data)('fecha_proxima_inspeccion')) {
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
        db.query('SELECT f.criterio_inspeccion FROM flota AS f, base AS b WHERE f.id = b.id_flota AND b.id = ' + data.id_base, (err, result) => {
            if (err) throw err
            
            data.fecha_proxima_inspeccion = utils.get_fecha_proxima_inspeccion(result)

            db.query('INSERT INTO vehiculo SET ?', data, function(err2, result2) {
                if (err2) throw err2
                json ={
                    data: result2
                }
                res.statusCode = 201
                res.send(json)
            })
        })
    }
})


router.put('/(:id)', function(req, res, next) {
    let json
    let id = req.params.id
    let data = req.body

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
        db.query('UPDATE vehiculo SET ? WHERE id = ' + id, data, function(err, result) {
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

    db.query('DELETE FROM vehiculo WHERE id = ' + id, function(err, result) {
        if (err) throw err
        json ={
            data: result
        }
        res.statusCode = 200
        res.send(json)
    })
})

module.exports = router;