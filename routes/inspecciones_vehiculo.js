const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    let json
    db.query("SELECT id_vehiculo, km, fecha, mm_prof_1, mm_prof_2, mm_prof_3, bar_medido, bar_recomendado, bar_corregido, comentario FROM inspeccion_vehiculo", function(err, result){
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
        db.query("SELECT id_vehiculo, km, fecha, mm_prof_1, mm_prof_2, mm_prof_3, bar_medido, bar_recomendado, bar_corregido, comentario FROM inspeccion_vehiculo WHERE id = " + id, function(err, result){
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
        km: req.body.km,
        fecha: req.body.fecha,
        mm_prof_1: req.body.mm_prof_1,
        mm_prof_2: req.body.mm_prof_2,
        mm_prof_3: req.body.mm_prof_3,
        bar_medido: req.body.bar_medido,
        bar_recomendado: req.body.bar_recomendado,
        bar_corregido: req.body.bar_corregido,
        comentario: req.body.comentario
    }

    if(data.id_vehiculo.length === 0 || data.km.length === 0 || data.fecha.length === 0 || data.mm_prof_1.length === 0 || data.mm_prof_2.length === 0 || data.mm_prof_3.length === 0 || data.bar_medido.length === 0 || data.bar_recomendado.length === 0 || data.bar_corregido.length === 0) {
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
        db.query('INSERT INTO inspeccion_vehiculo SET ?', data, function(err, result) {
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
        id_vehiculo: req.body.id_vehiculo,
        km: req.body.km,
        fecha: req.body.fecha,
        mm_prof_1: req.body.mm_prof_1,
        mm_prof_2: req.body.mm_prof_2,
        mm_prof_3: req.body.mm_prof_3,
        bar_medido: req.body.bar_medido,
        bar_recomendado: req.body.bar_recomendado,
        bar_corregido: req.body.bar_corregido,
        comentario: req.body.comentario
    }
        console.log(data)
    // modifies "data" object deleting undefined fields.
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key])
        console.log(data)
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
        console.log(data)
        db.query('UPDATE inspeccion_vehiculo SET ? WHERE id = ' + id, data, function(err, result) {
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

    db.query('DELETE FROM inspeccion_vehiculo WHERE id = ' + id, function(err, result) {
        if (err) throw err
        json ={
            data: result
        }
        res.statusCode = 200
        res.send(json)
    })
})

module.exports = router;