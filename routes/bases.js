const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    let json
    db.query("SELECT b.nombre, count(b.nombre) AS num_vehiculos FROM vehiculo AS v, base AS b WHERE b.id = v.id_base GROUP BY b.nombre", function(err, result){
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
    if(id.length === 0) {
        json = {
            data: undefined,
            error: "Introduzca el id"
        }
        res.statusCode = 400 
        res.send(json)
    }else{ 
        db.query("SELECT matricula, tipo_vehiculo FROM vehiculo WHERE id_base = " + req.params.id, (err, result) => {
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
        nombre: req.body.nombre,
        id_flota: req.body.id_flota
    }   

    if(data.nombre.length === 0 && data.criterio_inspeccion.length === 0) {
        json = {
            data: undefined,
            error: "Introduzca los campos requeridos"
        }
        res.statusCode = 400 
        res.send(json)
    }else{
        db.query('INSERT INTO base SET ?', data, function(err, result) {
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
        nombre: req.body.nombre,
        id_flota: req.body.id_flota
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
        db.query('UPDATE base SET ? WHERE id = ' + id, data, function(err, result) {
            if (err) throw err
            json ={
                data: result
            }
            res.statusCode = 200
        })
    }
    res.send(json)
})

router.delete('/(:id)', function(req, res, next) {
    let json
    let id = req.params.id
    db.query('DELETE FROM base WHERE id = ' + id, function(err, result) {
        if (err) throw err
        json ={
            data: result
        }
        res.statusCode = 200
    })
    res.send(json)
})

module.exports = router;
