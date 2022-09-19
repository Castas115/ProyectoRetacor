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

    connection.query("select * from flota", function(error, results){
        if (error) throw error;
        console.log("flotas called.");

        res.send((results));
    })
})


/*app.get('/flota/:id', (req, res) => {
    connection.connect();

    connection.query("select * from flota where id, function(error, results){
        if (error) throw error;
        console.log("flotas called.");

        res.send((results));
    })
    connection.end();
})*/