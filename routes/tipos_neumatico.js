const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
    let json
    db.query("SELECT dimension, marca, modelo FROM tipo_neumatico", function(err, result){
        if (err) throw err
        json ={
            data: result
        }
        res.statusCode = 200
        res.send(json)
    })
})

router.get('/(:id)', (req, res) => {
    let id = req.params.id
    let json
    if(id.length === 0) {
        json = {
            data: undefined,
            error: "Introduzca el id"
        }
        res.statusCode = 400 
        res.send(json)
    }else{ 
        db.query("SELECT dimension, marca, modelo FROM tipo_neumatico WHERE id = " + req.params.id, function(err, result){
            if (err) throw err
            json ={
                data: result
            }
            res.statusCode = 200
            res.send(json)
        })
    }
})

router.post('/', function(req, res, next) {
    let json
    let data = req.body
    
    if(Object.keys(data).length == 0) {
        json = {
            data: undefined,
            error: "Introduzca los campos a modificar"
        }
        res.statusCode = 400 
        res.send(json)
    }else{
        let sql
        for (let key in data) {
            if(!Object.hasOwnProperty.bind(data)(key) && Object.getOwnPropertyNames(data[key]).toString() == ['dimension', 'marca', 'modelo'].toString()) {
              sql = (sql!=undefined ? sql+ ", " : "") + "('" + data[key].dimension + "', '"  + data[key].marca + "', '" + data[key].modelo + "')";
            }else{
                json = {
                    data: undefined,
                    error: "Introduzca los campos requeridos"
                }
                res.statusCode = 400 
                res.send(json)
            }
        }
        
        db.query("INSERT INTO tipo_neumatico (dimension, marca, modelo) values " + sql, function(err, result) {
            if (err) throw err
            json ={
                data: result
            }
            res.statusCode = 201
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
        db.query('UPDATE tipo_neumatico SET ? WHERE id = ' + id, data, function(err, result) {
            if (err) throw err
            json ={
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

    db.query('DELETE FROM tipo_neumatico WHERE id = ' + id, function(err, result) {
        if (err) throw err
        json ={
            data: result
        }
        res.statusCode = 200
        res.send(json)
    })
})

module.exports = router;