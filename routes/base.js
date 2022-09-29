const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    db.query("SELECT b.nombre, count(b.nombre) AS num_vehiculos FROM vehiculo AS v, base AS b WHERE b.id = v.id_base GROUP BY b.nombre", function(err, result){
        if (err) throw err
        res.send(result)
    })
})


router.get('/(:id)', (req, res) => {
    db.query("select b.nombre, count(b.nombre) AS n_vehiculos from base AS b, vehiculo AS v WHERE b.id = " + req.params.id, (err, result) => {
    res.send(result)
    })
})


router.post('/add', function(req, res, next) {
    let data = {
        nombre: req.body.nombre,
        id_flota: req.body.id_flota
    }   

    if(data.nombre.length === 0 && data.criterio_inspeccion.length === 0) {
        req.flash('error', "Introduzca los campos requeridos")
    }else{
        db.query('INSERT INTO base SET ?', data, function(err, result) {
            if (err) throw err
            res.send(result)
        })
    }
})

router.put('/update/(:id)', function(req, res, next) {
    let id = req.params.id
    let data = {
        nombre: req.body.nombre,
        id_flota: req.body.id_flota
    }
    // modifies "data" object deleting undefined fields.
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key])

    if(id.length === 0) {
        req.flash('error', "Introduzca el id ")
    }else if(JSON.stringify(data).length <= 1) {
    }else{
        db.query('UPDATE base SET ? WHERE id = ' + id, data, function(err, result) {
            if (err) throw err
            res.send(result)
        })
    }
})

router.delete('/delete/(:id)', function(req, res, next) {
    let id = req.params.id

    db.query('DELETE FROM base WHERE id = ' + id, function(err, result) {
        if (err) throw err
        res.send(result)
    })
})

module.exports = router;