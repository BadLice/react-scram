var express = require('express');
var router = express.Router();

router.post('/', (clientReq, clientRes, next) => {
	let sql = "UPDATE task SET phase_id='"+clientReq.body.phaseKey+"' WHERE task.id='"+clientReq.body.taskKey+"'";

	dbPool.execQuery(sql, clientReq, clientRes,(queryErr, queryRes) => {

		if(queryErr ) {
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
