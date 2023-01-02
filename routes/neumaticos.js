const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    let json
    db.query(`SELECT n.id, n.id_vehiculo, n.posicion, n.mm, n.presion, 
    (SELECT IF(count(sn.id) = 0, false, true) FROM servicio_neumatico AS sn WHERE sn.id_neumatico = n.id AND sn.id_tipo_servicio = 7) AS reesculturado
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
        db.query(`SELECT tn.dimension, tn.marca, tn.modelo, n.posicion, n.mm, n.presion, v.matricula, b.id_flota,
        s.nombre, sn.km_vehiculo, sn.fecha, sn.id_proveedor_servicio, sn.comentario, 0 AS reesculturado
        FROM neumatico as n 
        LEFT JOIN vehiculo AS v ON v.id = n.id_vehiculo 
        LEFT JOIN base AS b ON b.id = v.id_base
        LEFT JOIN tipo_neumatico AS tn ON n.id_tipo_neumatico = tn.id 
        LEFT JOIN servicio_neumatico AS sn ON n.id = sn.id_neumatico
        LEFT JOIN tipo_servicio as s ON s.id = sn.id_tipo_servicio
        WHERE n.id = ` + id , function(err, result){
            if (err) throw err

            result = Object.values(result.reduce((r, { dimension, marca, modelo, posicion, mm, presion, matricula, id_flota, reesculturado, ...o }) =>{
                r[matricula] ??= { dimension, marca, modelo, posicion, mm, presion, matricula, id_flota, reesculturado, servicios: [] }

                console.log(r)
                if(o.nombre != null){
                    r[matricula].servicios.push(o)
                    if(r[matricula].reesculturado != 1 && o.nombre == "Reesculturado"){
                        r[matricula].reesculturado = 1
                    }
                }
                return r
            }, {}))

            json ={
                data: result[0]
            }

            res.statusCode = 200
            res.send(json)
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