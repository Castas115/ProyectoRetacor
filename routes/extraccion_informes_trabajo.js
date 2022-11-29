const express = require('express')
const router = express.Router()
const db = require('../lib/db')
const async = require('async')
const utils = require('../lib/utils')

router.get('/', (req, res) => {
    let json
    let data = req.body
    let query = `SELECT b.id AS id_base, b.nombre AS nombre_base, (SELECT f.nombre FROM flota AS f WHERE b.id_flota = f.id) AS nombre_flota, 
            v.matricula, v.id AS id_vehiculo,
            s.nombre AS nombre_servicio_vehiculo, sv.comentario AS comentario_servicio_vehiculo, sv.fecha AS fecha_servicio_vehiculo
            FROM base AS b
            JOIN vehiculo AS v on v.id_base = b.id
            JOIN servicio_vehiculo AS sv on sv.id_vehiculo = v.id 
            JOIN tipo_servicio AS s ON s.id = sv.id_tipo_servicio
            WHERE b.id in (1,2)`
    if (Object.hasOwnProperty.bind(data)('fecha_inicio')){
        query += " AND sv.fecha >= '" + data.fecha_inicio + "'"
    }
    if (Object.hasOwnProperty.bind(data)('fecha_fin')){
        query += " AND sv.fecha <= '" + data.fecha_fin  + "'"
    }
    query += " ORDER BY sv.fecha"

    console.log(query)
    db.query(query, function(err, result){
        if (err){
            console.log(err)
        }


        let resultado = Object.values(result.reduce((r, { id_base, nombre_base, nombre_flota, ...o }) =>{
                r[id_base] ??= { id_base, nombre_base, nombre_flota, vehiculos: [] }
                r[id_base].vehiculos.push(o)

                return r
        }, {}))


        resultado.forEach((linea)=>{
                linea.vehiculos = linea.vehiculos.reduce((r, { matricula, id_vehiculo , ...o }) => {
                    r[id_vehiculo] ??= { matricula, id_vehiculo, servicios: [] }
                    r[id_vehiculo].servicios.push(o)

                return r;
            }, {})
        })
        json ={
            data: resultado
        }
        res.statusCode = 202
        res.send(json)
    })
})

module.exports = router;