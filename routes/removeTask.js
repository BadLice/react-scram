var express = require('express');
var router = express.Router();

router.post('/', (clientReq, clientRes, next) => {
	let sql = "DELETE FROM task WHERE id='"+clientReq.body.taskKey+"'";
	console.log(sql)

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
