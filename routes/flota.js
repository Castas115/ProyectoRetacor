const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    db.query("select * from flota", function(err, result){
        if (err) {
            req.flash('error', err)
            //res.redirect('/')
        } else {
            req.flash('success', "flotas visualizadas")
            res.send(result)
        }
    })
})

router.get('/(:id)', (req, res) => {
    db.query("select * from flota where id = " + req.params.id, function(err, result){
        if (err) {
            req.flash('error', err)
            //res.redirect('/')
        } else {
            req.flash('success', "flota visualizada")
            res.send(result)
        }
    })
})

router.post('/add', function(req, res, next) {
    let flota_data = {
        nombre: req.body.nombre,
        criterio_inspeccion: req.body.criterio_inspeccion
    }   
    if(flota_data.nombre.length === 0 && flota_data.criterio_inspeccion.length === 0) {
        req.flash('error', "Introduzca nombre o criterio de inspeccion")
    }else{
        db.query('INSERT INTO flota SET ?', flota_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                //res.redirect('/')
            } else {
                req.flash('success', "flota añadida")
                res.send(result)
            }
        })
    }
})

router.put('/update/(:id)', function(req, res, next) {
    let flota_data = {
        id: req.params.id,
        nombre: req.body.nombre,
        criterio_inspeccion: req.body.criterio_inspeccion
    }

    if(flota_data.id.length === 0) {
        req.flash('error', "Introduzca el id ")
    //}else if(JSON.stringify(flota_data).length > 1) {
    //    req.flash('error', "Introduzca los parametros que desea modificar")
    }else{
        db.query('UPDATE flota SET ? WHERE id = ' + flota_data.id, flota_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                //res.redirect('/')
            } else {
                req.flash('success', "flota actualizada")
                res.send(result)
            }
        })
    }
})

router.get('/delete/(:id)', function(req, res, next) {
    let id = req.params.id

    dbConn.query('DELETE FROM flota WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            //res.redirect('/')
        } else {
            req.flash('success', "flota eliminada")
            res.send(result)
        }
    })
})

module.exports = router;