var express = require('express');
var router = express.Router();

router.post('/', (clientReq, clientRes, next) => {

	let sql="INSERT INTO account(id, username, password) VALUES (UUID(),?,?)";
	let params = [
		clientReq.body.username,
		clientReq.body.password
	];

	if(clientReq.body.username.length>32 || clientReq.body.username.length < 5) {
		clientRes.send({
			success: false
		});
		clientRes.end();
		return;
	}

	dbPool.execQueryNoSessionValidation(sql, params, clientReq, clientRes,(queryErr, queryRes) => {
		if(queryErr) {
			clientRes.send({
				success: false,
				queryErr: true
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
