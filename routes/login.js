var express = require('express');
var router = express.Router();

router.post('/', (clientReq, clientRes, next) => {

	let sql = "SELECT id FROM account WHERE username='"+clientReq.body.username+"' AND password='"+clientReq.body.password+"'";

	dbPool.execQueryNoSessionValidation(sql, clientReq, clientRes,(queryErr, queryRes) => {
		if(queryErr) {
			clientRes.send({
				success: false
			});
			clientReq.session.userId = null;
		}
		else {
			if(queryRes.length>0) {
				clientRes.send({
					success: true,
					sessionId: clientReq.session.id
				});

				clientReq.session.userId = queryRes[0].id;
			}
			else {
				clientRes.send({
					success: true,
					sessionId: null
				});
				clientReq.session.userId = null;
			}
		}
		clientReq.session.save()
		clientRes.end();
	});
});

module.exports = router;
