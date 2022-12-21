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
            s.nombre AS nombre_servicio, sv.comentario, sv.fecha 
            FROM base AS b
            JOIN vehiculo AS v on v.id_base = b.id
            LEFT JOIN servicio_vehiculo AS sv ON v.id = sv.id_vehiculo
            LEFT JOIN tipo_servicio AS s ON s.id = sv.id_tipo_servicio
            WHERE 1=1`
    if (Object.hasOwnProperty.bind(data)('fecha_inicio')){
        query += " AND (sv.id_vehiculo = v.id XOR sv.fecha >= '" + data.fecha_inicio + "')"
    }
    if (Object.hasOwnProperty.bind(data)('fecha_fin')){
        query += " AND (sv.id_vehiculo = v.id XOR sv.fecha <= '" + data.fecha_fin  + "')"
    }
    query += " ORDER BY sv.fecha"

    db.query(query, function(err, result){
        if (err){
            console.log(err)
        }

        query = `SELECT n.id_vehiculo, n.id, n.posicion, tn.dimension, tn.marca, tn.modelo,
                s.nombre AS nombre_servicio, sn.comentario, sn.fecha 
                FROM neumatico AS n
                JOIN tipo_neumatico AS tn on tn.id = n.id_tipo_neumatico 
                JOIN servicio_neumatico AS sn on sn.id_neumatico = n.id 
                JOIN tipo_servicio AS s ON s.id = sn.id_tipo_servicio
                WHERE n.id_vehiculo IN (` + result.map((linea) => linea.id_vehiculo) + ')'
        if (Object.hasOwnProperty.bind(data)('fecha_inicio')){
            query += " AND sn.fecha >= '" + data.fecha_inicio + "'"
        }
        if (Object.hasOwnProperty.bind(data)('fecha_fin')){
            query += " AND sn.fecha <= '" + data.fecha_fin  + "'"
        }
        query += " ORDER BY sn.fecha"

        db.query(query, function(err, result2){
            if (err){
                console.log(err)
            }

            //creamos un array de servicios en cada neumático
            let neumaticosAgrupados = Object.values(result2.reduce((r, { id, id_vehiculo, posicion, dimension, marca, modelo, ...o }) =>{
                    r[id] ??= { id, id_vehiculo, posicion, dimension, marca, modelo, servicios: [] }
                    r[id].servicios.push(o)

                    return r
            }, {}))
            //map de cada neumático con el id del vehiculo
            neumaticosAgrupados = neumaticosAgrupados.reduce((group, linea) => {
                const { id_vehiculo } = linea
                group[id_vehiculo] = group[id_vehiculo] ?? []
                delete linea.id_vehiculo
                group[id_vehiculo].push(linea)
                return group
            }, {})

            //creamos array de vehículos en cada base
            let resultado = Object.values(result.reduce((r, { id_base, nombre_base, nombre_flota, ...o }) =>{
                    r[id_base] ??= { id_base, nombre_base, nombre_flota, vehiculos: [] }
                    r[id_base].vehiculos.push(o)

                    return r
            }, {}))

            //creamos el array de servicio en cada vehículo y añadimos los neumáticos
            resultado.forEach((linea, i)=>{
                linea.vehiculos = linea.vehiculos.reduce((r, { matricula, id_vehiculo , ...o}, j) => {
                    r[id_vehiculo] ??= { matricula, id_vehiculo, servicios: [], neumaticos: [] }
                    
                    let sinServiciosNiVehiculos = true
                    if(r[id_vehiculo].nombre_servicio != null){
                        r[id_vehiculo].servicios.push(o)
                        sinServiciosNiVehiculos = false
                    }
                    
                    //comprobar si hay neumaticos con servicios asociados
                    if(neumaticosAgrupados[id_vehiculo] != null){
                        r[id_vehiculo].neumaticos.push(neumaticosAgrupados[id_vehiculo])
                        sinServiciosNiVehiculos = false
                    }

                    if(sinServiciosNiVehiculos){
                        delete r[id_vehiculo]
                    }
                    return r
                }, {})
                //eliminamos la base si no hay vehículos asignados con servicios o cuyos neumáticos tengan servicios
                if(Object.values(linea.vehiculos).length == 0){
                    delete resultado[i]
                }
            })
            resultado = resultado.filter(element => {
                return element !== null;
            })
            json ={
                data: resultado
            }
            res.statusCode = 202
            res.send(json)
    })
    })
})

module.exports = router;