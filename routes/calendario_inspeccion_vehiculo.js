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
            SELECT b.id AS id_base, v.matricula, b.id_flota, i.fecha
            FROM base as b
            JOIN vehiculo as v on v.id_base = b.id
            JOIN inspeccion_vehiculo as i on i.id_vehiculo = v.id
            WHERE b.id IN (` + result.map((linea) => linea.id) + ')'
        if (Object.hasOwnProperty.bind(data)('fecha_inicio')){
            sql2 += " AND i.fecha >= '" + data.fecha_inicio + "'"
        }
        if (Object.hasOwnProperty.bind(data)('fecha_fin')){
            sql2 += " AND i.fecha <= '" + data.fecha_fin  + "'"
        }
        sql2 += " ORDER BY i.fecha"
        
        db.query(sql2, function(err, result2){

            // mapa con los id de las bases
            let mapBases = new Map(result.map( object => {return [object.id, object]}))
            
            // agrupamos los vehiculos inspeccionados por base
            let inspeccionesAgrupadas = result2.reduce((group, linea) => {
                const { id_base } = linea
                group[id_base] = group[id_base] ?? []
                delete linea.id_base
                group[id_base].push(linea)
                return group
            }, {})

            // añadimos los arrays de vehiculos inspeccionados a cada base
            let respuesta = []
            Object.keys(inspeccionesAgrupadas).forEach((key) =>{
                mapBases.get(parseInt(key)).inspecciones = inspeccionesAgrupadas[key]
                respuesta.push(mapBases.get(parseInt(key)))
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