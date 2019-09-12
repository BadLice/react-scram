var express = require('express');
var router = express.Router();

router.post('/', (clientReq, clientRes, next) => {

	let sql = "INSERT INTO phase(id, name, account_id) VALUES ('"+clientReq.body.key+"','','"+clientReq.session.userId+"')";

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
