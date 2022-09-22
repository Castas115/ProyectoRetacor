const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    db.query("select * from vehiculo", function(err, result){
        if (err) {
            req.flash('error', err)
            //res.redirect('/')
        } else {
            req.flash('success', "vehiculos visualizados")
            res.send(result)
        }
    })
})

router.get('/(:id)', (req, res) => {
    db.query("select * from vehiculo where id = " + req.params.id, function(err, result){
        if (err) {
            req.flash('error', err)
            //res.redirect('/')
        } else {
            req.flash('success', "vehiculo visualizado")
            res.send(result)
        }
    })
})

router.post('/add', function(req, res, next) {
    let vehiculo_data = {
        matricula: req.body.matricula,
        clase_vehiculo: req.body.clase_vehiculo,
        tipo_vehiculo: req.body.tipo_vehiculo,
        km: req.body.km,
        id_base: req.body.id_base,
        observaciones: req.body.observaciones,
        fecha_proxima_inspeccion: req.body.fecha_proxima_inspeccion
    }
    
    if(vehiculo_data.matricula.length === 0 && vehiculo_data.clase_vehiculo.length === 0 && vehiculo_data.tipo_vehiculo.length === 0 && vehiculo_data.km.length === 0 && vehiculo_data.id_base.length === 0 &&  vehiculo_data.fecha_proxima_inspeccion.length === 0) {
        req.flash('error', "Introduzca los campos requeridos")
    }else{
        db.query('INSERT INTO vehiculo SET ?', vehiculo_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                //res.redirect('/')
            } else {
                req.flash('success', "vehiculo añadida")
                res.send(result)
            }
        })
    }
})

router.put('/update/(:id)', function(req, res, next) {
    let vehiculo_data = {
        id: req.params.id,
        matricula: req.body.nombre,
        clase_vehiculo: req.body.nombre,
        tipo_vehiculo: req.body.nombre,
        km: req.body.nombre,
        id_base: req.body.nombre,
        observaciones: req.body.nombre,
        fecha_proxima_inspeccion: req.body.nombre
    }

    if(vehiculo_data.id.length === 0) {
        req.flash('error', "Introduzca el id ")
    //}else if(JSON.stringify(vehiculo_data).length) {
    //    req.flash('error', "Introduzca los parametros que desea modificar")
    }else{
        db.query('UPDATE vehiculo SET ? WHERE id = ' + vehiculo_data.id, vehiculo_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                //res.redirect('/')
            } else {
                req.flash('success', "vehiculo actualizado")
                res.send(result)
            }
        })
    }
})

router.get('/delete/(:id)', function(req, res, next) {
    let id = req.params.id

    dbConn.query('DELETE FROM vehiculo WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            //res.redirect('/')
        } else {
            req.flash('success', "vehiculo eliminado")
            res.send(result)
        }
    })
})

module.exports = router;