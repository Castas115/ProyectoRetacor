const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    let json
    let data = req.body
    let sql = `SELECT b.id, b.nombre, count(v.id) AS n_vehiculos
    FROM base AS b
    JOIN vehiculo as v on v.id_base = b.id
    WHERE 1=1 
    `
    if (Object.hasOwnProperty.bind(data)('flota')){
        sql += " AND b.id_flota = " + data.flota
    }
    if (Object.hasOwnProperty.bind(data)('base')){
        sql += " AND b.id = " + data.base
    }
    sql += " GROUP BY b.nombre"
    db.query(sql, function(err, result){
        if (err) throw err

        let sql2 = `
            SELECT v.id_base, v.id AS id_vehiculo, v.matricula, v.fecha_proxima_inspeccion, b.id_flota, i.fecha, i.id AS id_inspeccion
            FROM vehiculo as v 
            left JOIN base as b on v.id_base = b.id
            left JOIN inspeccion_vehiculo as i on i.id_vehiculo = v.id  
            `
        if (Object.hasOwnProperty.bind(data)('fecha_inicio')){
            sql2 += " AND i.fecha >= '" + data.fecha_inicio + "'"
        }
        if (Object.hasOwnProperty.bind(data)('fecha_fin')){
            sql2 += " AND i.fecha <= '" + data.fecha_fin  + "'"
        }
        sql2 += `WHERE b.id IN ( `+ result.map((linea) => linea.id) + `) 
            ORDER BY i.fecha`
        
        db.query(sql2, function(err, result2){
            if (err) throw err

            // mapa con los id de las bases
            let mapBases = new Map(result.map( object => {return [object.id, object]}))
            
            // agrupamos los vehiculos inspeccionados por base
            let pendientesInspeccion = result2.reduce((group, linea) => {
                const { id_base } = linea
                group[id_base] = group[id_base] ?? []
                delete linea.id_base
                if(linea.id_inspeccion == null && linea.fecha_proxima_inspeccion < new Date()){
                    group[id_base] = group[id_base] ?? []
                    delete linea.fecha
                    delete linea.id_inspeccion
                    delete linea.mes
                    group[id_base].push(linea)
                }
                return group
            }, {})

            // añadimos los arrays de vehiculos inspeccionados a cada base
            let respuesta = []

            mapBases.forEach((linea, index) => {
                if (Object.keys(pendientesInspeccion[index]).length != 0){
                    linea.pendientes_inspeccion = pendientesInspeccion[index]
                    respuesta.push(linea)
                }
            })

            json ={
                data: respuesta
            }
            
            res.statusCode = 200
            res.send(json)
        })
    })
})

module.exports = router;