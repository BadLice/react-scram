var express = require('express');
var router = express.Router();

router.post('/', (clientReq, clientRes, next) => {

	let sql = "SELECT id FROM account WHERE username=? AND password=?";
	let params = [
		clientReq.body.username,
		clientReq.body.password
	]

	dbPool.execQueryNoSessionValidation(sql, params, clientReq, clientRes,(queryErr, queryRes) => {
		//query is malformed or other sql errors
		if(queryErr) {
			clientRes.send({
				success: false,
				queryErr: true
			});
			clientRes.end();
		}
		else {
			//user is authenticated
			if(queryRes.length>0) {

				let usrId = queryRes[0].id;

				//execute query to set cookie session for persistent login
				let ckid = uuid();
				let cksql = "UPDATE account SET cookie_session=? WHERE id=?"
				let ckparams=[
					ckid,
					usrId
				];
				dbPool.execQueryNoSessionValidation(cksql, ckparams, clientReq, clientRes, (queryErr, ckQueryRes) => {
					if(queryErr) {
						clientRes.send({
							success: false,
							queryErr: true
						});
						clientRes.end();
					}
					else {
						clientReq.session.userId = queryRes[0].id;
						clientReq.session.cookieSessionId=ckid;
						clientRes.send({
							success: true,
						});
						clientRes.end(clientReq.session);
					}
				});
			}
			else {
				clientRes.send({
					success: false,
				});
				clientRes.end();
			}
		}
	});
});

module.exports = router;
