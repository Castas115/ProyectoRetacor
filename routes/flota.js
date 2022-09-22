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
    let data = {
        nombre: req.body.nombre,
        criterio_inspeccion: req.body.criterio_inspeccion
    }   
    if(data.nombre.length === 0 && data.criterio_inspeccion.length === 0) {
        req.flash('error', "Introduzca nombre o criterio de inspeccion")
    }else{
        db.query('INSERT INTO flota SET ?', data, function(err, result) {
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
    let id = req.params.id
    let data = {
        nombre: req.body.nombre,
        criterio_inspeccion: req.body.criterio_inspeccion
    }
    //  TODO: revisar si hay mejor manera
    // modifies "data" object deleting undefined fields.
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key])

    if(id.length === 0) {
        req.flash('error', "Introduzca el id ")
    }else if(JSON.stringify(data).length <= 1) {
        req.flash('error', "Introduzca los parametros que desea modificar")
    }else{
        db.query('UPDATE flota SET ? WHERE id = ' + id, data, function(err, result) {
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

router.delete('/delete/(:id)', function(req, res, next) {
    let id = req.params.id

    db.query('DELETE FROM flota WHERE id = ' + id, function(err, result) {
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