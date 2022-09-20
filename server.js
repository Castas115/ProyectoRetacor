const http = require("http");
const express = require('express');
const app = express();
const sql = require('mysql');
const port = 3000;

const connection = sql.createConnection({
    host : 'localhost',
    user : 'jon',
    password  :'',
    database : 'retacor'
});

connection.connect((err)=>{
    if (err) throw err;
    console.log('MySql Connected');
});


app.listen(3000, function () {
    console.log('listening on '+port)
});

app.get('/flotas', (req, res) => {

    connection.query("select * from flota", function(err, results){
        if (err) throw err;
        console.log("get flotas called.");

        res.send((results));
    });
});

// FIXME: Cannot GET /flota
app.get('/flota/(:id)', (req, res) => {
     let id = req.params.id;
    connection.query("select * from flota where id = " + id, function(err, results){
        if (err) throw err;
        console.log("get flota called.");

        res.send((results));
    });
});


app.post('/add', function(req, res, next) {
    let flota_data = {
        nombre: req.params.nombre,
        
    }

    dbConn.query('INSERT INTO flota SET ?', flota_data, function(err, result) {
        if(err) throw err
        console.log("set flota called.");

        res.send((results));
    });
});

app.post('/update/(:id)', function(req, res, next) {
    let flota_data = {
        id: req.params.id,
        nombre: req.params.nombre,
        
    }

    dbConn.query('UPDATE flota SET ? WHERE id = ' + id, flota_data, function(err, result) {
        if(err) throw err
        console.log("set flota called.");

        res.send((results));
    });
});

app.get('/delete/(:id)', function(req, res, next) {
    let id = req.params.id;

    dbConn.query('DELETE FROM flota WHERE id = ' + id, function(err, result) {
        if(err) throw err

        console.log("delete flota called.");

        res.send((results));
    });
});