const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    let json
    db.query(`SELECT n.id, n.id_vehiculo, n.posicion, n.mm, n.presion, 
    (SELECT IF(count(sn.id) = 0, false, true FROM servicio_neumatico AS sn WHERE sn.id_neumatico = n.id AND sn.id_tipo_servicio = 7) AS reesculturado
    FROM neumatico AS n` 
    , function(err, result){
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
        db.query(`SELECT tn.dimension, tn.marca, tn.modelo, n.posicion, n.mm, n.presion, v.matricula, 
        (SELECT b.id_flota FROM base AS b WHERE b.id = v.id_base) AS id_flota
        FROM neumatico as n 
        JOIN vehiculo AS v ON v.id = n.id_vehiculo 
        JOIN tipo_neumatico AS tn ON n.id_tipo_neumatico = tn.id 
        WHERE n.id = ` + id , function(err, result){
            if (err) throw err

            db.query("SELECT (SELECT s.nombre FROM tipo_servicio as s WHERE s.id = servicio_neumatico.id_tipo_servicio) as nombre, km_vehiculo, fecha, id_proveedor_servicio, comentario FROM servicio_neumatico WHERE id_neumatico = " + id, (err2, result2) =>{

                result[0].reesculturado = result2.filter(i => i.nombre == "Reesculturado").length != 0
                json ={
                    data: result[0]
                }
                json.data.servicios= result2

                res.statusCode = 200
                res.send(json)
            })
        })
    }
})

router.post('/', function(req, res, next) {
    let json
    let data = req.body

    if (!Object.hasOwnProperty.bind(data)('id_vehiculo') && !Object.hasOwnProperty.bind(data)('posicion') && !Object.hasOwnProperty.bind(data)('mm') && !Object.hasOwnProperty.bind(data)('presion') && !Object.hasOwnProperty.bind(data)('id_tipo_neumatico')) {
        json = {
            data: undefined,
            error: "Introduzca los campos requeridos"
        }
        res.statusCode = 400 
        res.send(json)
    }else if(Object.keys(data).length == 0) {
        json = {
            data: undefined,
            error: "Introduzca los campos a modificar"
        }
        res.statusCode = 400 
        res.send(json)
    }else{
        db.query('INSERT INTO neumatico SET ?', data, function(err, result) {
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
    let json
    let id = req.params.id
    let data = req.body

    if(id.length === 0) {
        json = {
            data: undefined,
            error: "Introduzca el id"
        }
        res.statusCode = 400 
        res.send(json)
    }else if(Object.keys(data).length == 0) {
        json = {
            data: undefined,
            error: "Introduzca los campos a modificar"
        }
        res.statusCode = 400 
        res.send(json)
    }else{
        db.query('UPDATE neumatico SET ? WHERE id = ' + id, data, function(err, result) {
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
    let json
    let id = req.params.id

    db.query('DELETE FROM neumatico WHERE id = ' + id, function(err, result) {
        if (err) throw err
        json = {
            data: result
        }
        res.statusCode = 200
        res.send(json)
    })
})

module.exports = router;