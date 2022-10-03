const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    let json
    db.query("SELECT f.nombre, count(f.nombre) AS n_vehiculos FROM flota AS f, vehiculo AS v, base AS b WHERE b.id = v.id_base AND b.id_flota = f.id GROUP BY f.nombre", function(err, result){
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
        db.query("select b.nombre, count(b.nombre) AS n_vehiculos from base AS b, vehiculo AS v WHERE b.id = v.id_base AND b.id_flota = " + req.params.id + "  GROUP BY b.nombre", (err, result) => {
            json ={
                data: {
                    bases: result,
                    n_vehiculos: result.reduce((sum, val) => sum + val.n_vehiculos, 0)
                }
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
        criterio_inspeccion: req.body.criterio_inspeccion
    }   
    if(data.nombre.length === 0 && data.criterio_inspeccion.length === 0) {
        json = {
            data: undefined,
            error: "Introduzca nombre o criterio de inspeccion"
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
        db.query('INSERT INTO flota SET ?', data, function(err, result) {
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
        nombre: req.body.nombre,
        criterio_inspeccion: req.body.criterio_inspeccion
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
        db.query('UPDATE flota SET ? WHERE id = ' + id, data, function(err, result) {
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

    db.query('DELETE FROM flota WHERE id = ' + id, function(err, result) {
        if (err) throw err
        json = {
            data: result
        }
        res.statusCode = 200
        res.send(json)
    })
})

module.exports = router;