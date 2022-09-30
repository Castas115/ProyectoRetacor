const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    db.query("SELECT * FROM vehiculo", function(err, result){
        if (err) throw err
        let json ={
            data: result
        }
        res.send(json)
    })
})

router.get('/(:id)', (req, res) => {
    db.query("SELECT * FROM vehiculo WHERE id = " + req.params.id, function(err, result){
        if (err) throw err
        let json ={
            data: result
        }
        res.send(json)
    })
})

router.post('/add', function(req, res, next) {
    let data = {
        matricula: req.body.matricula,
        clase_vehiculo: req.body.clase_vehiculo,
        tipo_vehiculo: req.body.tipo_vehiculo,
        km: req.body.km,
        id_base: req.body.id_base,
        observaciones: req.body.observaciones,
        fecha_proxima_inspeccion: req.body.fecha_proxima_inspeccion
    }
    
    if(data.matricula.length === 0 && data.clase_vehiculo.length === 0 && data.tipo_vehiculo.length === 0 && data.km.length === 0 && data.id_base.length === 0 &&  data.fecha_proxima_inspeccion.length === 0) {
        req.flash('error', "Introduzca los campos requeridos")
    }else{
        db.query('INSERT INTO vehiculo SET ?', data, function(err, result) {
            if (err) throw err
            let json ={
                data: result
            }
            res.send(json)
        })
    }
})

router.put('/update/(:id)', function(req, res, next) {
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
        req.flash('error', "Introduzca el id ")
    }else if(JSON.stringify(data).length <= 1) {
        req.flash('error', "Introduzca los parametros que desea modificar")
    }else{
        db.query('UPDATE vehiculo SET ? WHERE id = ' + id, data, function(err, result) {
            if (err) throw err
            let json ={
                data: result
            }
            res.send(json)
        })
    }
})

router.delete('/delete/(:id)', function(req, res, next) {
    let id = req.params.id

    db.query('DELETE FROM vehiculo WHERE id = ' + id, function(err, result) {
        if (err) throw err
        let json ={
            data: result
        }
        res.send(json)
    })
})

module.exports = router;