var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var flash = require('express-flash');
var session = require('express-session');
var sql = require('mysql');

var db  = require('./lib/db');
var flotaRouter = require('./routes/flotas');
var baseRouter = require('./routes/bases');
var vehiculoRouter = require('./routes/vehiculos');
var neumaticoRouter = require('./routes/neumaticos');
var tiposNeumaticoRouter = require('./routes/tipos_neumatico');
var inspeccionesVehiculoRouter = require('./routes/inspecciones_vehiculo');
var serviciosNeumaticoRouter = require('./routes/servicios_neumatico');
var serviciosVehiculoRouter = require('./routes/servicios_vehiculo');
var tiposServicioRouter = require('./routes/tipos_servicio');
var calendarioInspeccionVehiculo = require('./routes/calendario_inspeccion_vehiculo');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))
app.use(flash());

app.use('/flotas', flotaRouter);
app.use('/bases', baseRouter);
app.use('/vehiculos', vehiculoRouter);
app.use('/neumaticos', neumaticoRouter);
app.use('/tipos_neumatico', tiposNeumaticoRouter);
app.use('/inspecciones_vehiculo', inspeccionesVehiculoRouter);
app.use('/servicios_neumatico', serviciosNeumaticoRouter);
app.use('/servicios_vehiculo', serviciosVehiculoRouter);
app.use('/tipos_servicio', tiposServicioRouter);
app.use('/calendario_inspeccion_vehiculo', calendarioInspeccionVehiculo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
