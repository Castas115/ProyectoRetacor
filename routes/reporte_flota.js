const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    let json
    let data = req.body
    let query = `SELECT DISTINCT
            b.id AS id_base, b.nombre AS nombre_base, 
            f.id AS id_flota, f.nombre AS nombre_flota, 
            v.matricula, v.id AS id_vehiculo, v.clase_vehiculo, v.tipo_vehiculo, v.fecha_proxima_inspeccion,
            n.id AS id_neumatico, n.posicion, n.mm, n.presion, 
            tn.dimension, tn.marca, tn.modelo, 
            '0' AS reesculturado, sn.id AS id_servicio, s.nombre AS nombre_servicio, sn.comentario, sn.fecha
            FROM flota AS f
            LEFT JOIN base AS b ON b.id_flota = f.id 
            LEFT JOIN vehiculo AS v on v.id_base = b.id
            LEFT JOIN neumatico AS n ON n.id_vehiculo = v.id
            LEFT JOIN tipo_neumatico AS tn ON tn.id = n.id_tipo_neumatico
            LEFT JOIN servicio_neumatico AS sn ON sn.id_neumatico = n.id
            LEFT JOIN tipo_servicio AS s ON s.id = sn.id_tipo_servicio
            WHERE 1=1 `

        if (Object.hasOwnProperty.bind(data)('flota')){
            query += " AND f.id = '" + data.flota + "'"
        }

    db.query(query, function(err, result){
        if (err){
            console.log(err)
        }

        let ids_vehiculo = Array.from(new Set(result.map((linea) => linea.id_vehiculo).filter(e => { return e !== null })))
        
        query = `SELECT DISTINCT sv.id_vehiculo, sv.id AS id_servicio, 
                s.nombre AS nombre_servicio, sv.comentario, sv.fecha 
                FROM servicio_vehiculo AS sv
                JOIN tipo_servicio AS s ON s.id = sv.id_tipo_servicio
                WHERE sv.id_vehiculo IN (` + ids_vehiculo + ')'

        db.query(query, function(err, result2){

            if (err){
                console.log(err)
            }

            let serviciosVehiculo = result2.reduce((group, linea) => {
                const { id_vehiculo } = linea
                group[id_vehiculo] = group[id_vehiculo] ?? []
                delete linea.id_vehiculo
                group[id_vehiculo].push(linea)
                return group
            }, {})

            result = Object.values(result.reduce((r, { id_flota, nombre_flota, id_base, nombre_base, matricula, id_vehiculo, clase_vehiculo, tipo_vehiculo, fecha_proxima_inspeccion, id_neumatico, posicion, mm, presion, dimension, marca, modelo, reesculturado, ...o }) =>{
                    r[id_neumatico] ??= { id_flota, nombre_flota, id_base, nombre_base, matricula, id_vehiculo, clase_vehiculo, tipo_vehiculo, fecha_proxima_inspeccion, id_neumatico, posicion, mm, presion, dimension, marca, modelo, reesculturado, servicios: [] }

                    if(o.id_servicio != null){
                        r[id_neumatico].servicios.push(o)
                        if(o.nombre_servicio == 'Reesculturado'){
                            r[id_neumatico].reesculturado = 1
                        }
                    }
                    return r
            }, {}))

            result = Object.values(result.reduce((r, { id_flota, nombre_flota, id_base, nombre_base, matricula, id_vehiculo, clase_vehiculo, tipo_vehiculo, fecha_proxima_inspeccion, ...o }) =>{
                    r[id_vehiculo] ??= { id_flota, nombre_flota, id_base, nombre_base, matricula, id_vehiculo, clase_vehiculo, tipo_vehiculo, fecha_proxima_inspeccion, neumaticos: [], servicios: [] }

                    if(r[id_vehiculo].servicios.length == 0 && serviciosVehiculo[id_vehiculo] != null){
                        r[id_vehiculo].servicios.push(serviciosVehiculo[id_vehiculo])
                    }
                    if(o.id_neumatico != null){
                        r[id_vehiculo].neumaticos.push(o)
                    }
                    return r
            }, {}))


            result = Object.values(result.reduce((r, { id_flota, nombre_flota, id_base, nombre_base, ...o }) =>{
                    r[id_base] ??= { id_flota, nombre_flota, id_base, nombre_base, vehiculos: [] }
                    r[id_base].vehiculos.push(o)

                    return r
            }, {}))
            
            result = Object.values(result.reduce((r, { id_base, nombre_base, ...o }) =>{
                    r[id_base] ??= { id_base, nombre_base, flotas: [] }
                    r[id_base].flotas.push(o)

                    return r
            }, {}))

            json ={
                data: result
            }
            res.statusCode = 202
            res.send(json)
        })
    })
})

module.exports = router;