const sql = require('mysql')
const db = sql.createConnection({
    host : 'localhost',
    user : 'jon',
    password  :'',
    database : 'coolproyect_retacor'
})

db.connect(function(err){
	if(!!err) {
		console.log(err);
	} else {
		console.log('Connected..!');
	}
})

module.exports = db
