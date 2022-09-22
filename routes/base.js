const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    db.query("select * from base", function(err, result){
        if (err) {
            req.flash('error', err)
            //res.redirect('/')
        } else {
            req.flash('success', "bases visualizadas")
            res.send(result)
        }
    })
})

router.get('/(:id)', (req, res) => {
    db.query("select * from base where id = " + req.params.id, function(err, result){
        if (err) {
            req.flash('error', err)
            //res.redirect('/')
        } else {
            req.flash('success', "base visualizada")
            res.send(result)
        }
    })
})

router.post('/add', function(req, res, next) {
    let base_data = {
        nombre: req.body.nombre,
        id_flota: req.body.id_flota
}   
    if(base_data.nombre.length === 0 && base_data.criterio_inspeccion.length === 0) {
        req.flash('error', "Introduzca nombre o criterio de inspeccion")
    }else{
        db.query('INSERT INTO base SET ?', base_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                //res.redirect('/')
            } else {
                req.flash('success', "base añadida")
                res.send(result)
            }
        })
    }
})

router.put('/update/(:id)', function(req, res, next) {
    let base_data = {
        id: req.params.id,
        nombre: req.body.nombre,
        id_flota: req.body.id_flota
    }

    if(base_data.id.length === 0) {
        req.flash('error', "Introduzca el id ")
    }else if(JSON.stringify(base_data).length) {
        req.flash('error', "Introduzca los parametros que desea modificar")
    }else{
        db.query('UPDATE base SET ? WHERE id = ' + base_data.id, base_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                //res.redirect('/')
            } else {
                req.flash('success', "base actualizada")
                res.send(result)
            }
        })
    }
})

router.get('/delete/(:id)', function(req, res, next) {
    let id = req.params.id

    dbConn.query('DELETE FROM base WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            //res.redirect('/')
        } else {
            req.flash('success', "base eliminada")
            res.send(result)
        }
    })
})

module.exports = router;