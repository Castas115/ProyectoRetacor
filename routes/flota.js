const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    db.query("SELECT f.nombre, count(f.nombre) AS n_vehiculos FROM flota AS f, vehiculo AS v, base AS b WHERE b.id = v.id_base AND b.id_flota = f.id GROUP BY f.nombre", function(err, result){
        if (err) throw err
        res.send(result)
    })
})

router.get('/(:id)', (req, res) => {
    db.query("select b.nombre, count(b.nombre) AS n_vehiculos from base AS b, vehiculo AS v WHERE b.id = v.id_base AND b.id_flota = " + req.params.id + "  GROUP BY b.nombre", (err, result) => {

    let json ={
        data: {
            bases: result,
            n_vehiculos: result.reduce((sum, val) => sum + val.n_vehiculos, 0)
        }
    }
    res.send(json)
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
            if (err) throw err
            res.send(result)
        })
    }
})

router.put('/update/(:id)', function(req, res, next) {
    let id = req.params.id
    let data = {
        nombre: req.body.nombre,
        criterio_inspeccion: req.body.criterio_inspeccion
    }
    // modifies "data" object deleting undefined fields.
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key])

    if(id.length === 0) {
        req.flash('error', "Introduzca el id ")
    }else if(JSON.stringify(data).length <= 1) {
        req.flash('error', "Introduzca los parametros que desea modificar")
    }else{
        db.query('UPDATE flota SET ? WHERE id = ' + id, data, function(err, result) {
            if (err) throw err
            res.send(result)
        })
    }
})

router.delete('/delete/(:id)', function(req, res, next) {
    let id = req.params.id

    db.query('DELETE FROM flota WHERE id = ' + id, function(err, result) {
        if (err) throw err
        res.send(result)
    })
})

module.exports = router;