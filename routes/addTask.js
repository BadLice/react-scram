var express = require('express');
var router = express.Router();

router.post('/', (clientReq, clientRes, next) => {
	let sql = "INSERT INTO task(id, name, completed, date, state, priority, phase_id) VALUES ('"+clientReq.body.key+"','',0,'"+toMySqlDate(new Date())+"','','','"+clientReq.body.phaseKey+"')";

	dbPool.execQuery(sql, clientReq, clientRes,(queryErr, queryRes) => {

		if(queryErr) {
			clientRes.send({
				success: false
			});
		}
		else {
			clientRes.send({
				success: true
			});
		}

		clientRes.end();
	});
});

module.exports = router;
