
/** Toma la query de la criterio_inspeccion de flota*/
this.get_fecha_proxima_inspeccion = function(result) {
    let fecha = new Date()
    const mesesSuma = new Map([['mensual',1], ['bimensual',2], ['trimestral',3]])
    let criterio_inspeccion
    Object.keys(result).forEach(function(key) {
        criterio_inspeccion = result[key].criterio_inspeccion
    })
    return new Date(fecha.setMonth(fecha.getMonth() + mesesSuma.get(criterio_inspeccion)))
}