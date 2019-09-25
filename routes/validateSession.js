var express = require('express');
var router = express.Router();

router.post('/', (clientReq, clientRes, next) => {
	let cksql = "SELECT cookie_session FROM account WHERE cookie_session=? AND id=?";
	let ckparams=[
		clientReq.session.cookieSessionId,
		clientReq.session.userId
	];
	dbPool.execQueryNoSessionValidation(cksql, ckparams, clientReq, clientRes, (queryErr, queryRes) => {
		if(queryErr || queryRes.length <= 0) {
			clientRes.send({
				success: false
			});
		}
		else {
			//reset cookie expiration time (not working)
			// console.log(clientReq.session.maxAge)
			// clientReq.session.maxAge= 24 * 60 * 60 * 1000 // 24 hours
			// console.log(clientReq.session.maxAge)

			clientRes.send({
				success: true,
			});
			mapSocketClientIdf(clientReq.body.socketId,clientReq.session.userId);
		}
		clientRes.end(clientReq.session);
	});
});

module.exports = router;
