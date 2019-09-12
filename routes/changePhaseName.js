var express = require('express');
var router = express.Router();

router.post('/', (clientReq, clientRes, next) => {
	let sql = "UPDATE phase SET name='"+clientReq.body.name+"' WHERE id='"+clientReq.body.key+"'";

	dbPool.execQuery(sql, clientReq, clientRes,(queryErr, queryRes) => {

		if(queryErr || clientReq.session.id !== clientReq.body.sessionId) {
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
