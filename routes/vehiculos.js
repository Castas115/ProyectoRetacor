const express = require('express')
const router = express.Router()
const db = require('../lib/db')

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
    if(id.length === 0) {
        json = {
            data: undefined,
            error: "Introduzca el id"
        }
        res.statusCode = 400 
        res.send(json)
    }else{ 
        db.query("SELECT * FROM vehiculo WHERE id = " + req.params.id, function(err, result){
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
        matricula: req.body.matricula,
        clase_vehiculo: req.body.clase_vehiculo,
        tipo_vehiculo: req.body.tipo_vehiculo,
        km: req.body.km,
        id_base: req.body.id_base,
        observaciones: req.body.observaciones,
    }
    
    if(data.matricula.length === 0 && data.clase_vehiculo.length === 0 && data.tipo_vehiculo.length === 0 && data.km.length === 0 && data.id_base.length === 0 &&  data.fecha_proxima_inspeccion.length === 0) {
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
        db.query('SELECT f.criterio_inspeccion FROM flota AS f, base AS b WHERE f.id = b.id_flota AND b.id = ' + data.id_base, (err, result) => {
            if (err) throw err
            
            const mesesSuma = new Map([['mensual',1], ['bimensual',2], ['trimestral',3]])
            let hoy = new Date()
            let criterio_inspeccion
            Object.keys(result).forEach(function(key) {
                criterio_inspeccion = result[key].criterio_inspeccion
            })
            data.fecha_proxima_inspeccion = new Date(hoy.setMonth(hoy.getMonth() + mesesSuma.get(criterio_inspeccion)))

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
    let data = {
        matricula: req.body.matricula,
        clase_vehiculo: req.body.clase_vehiculo,
        tipo_vehiculo: req.body.tipo_vehiculo,
        km: req.body.km,
        id_base: req.body.id_base,
        observaciones: req.body.observaciones,
        fecha_proxima_inspeccion: req.body.fecha_proxima_inspeccion
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