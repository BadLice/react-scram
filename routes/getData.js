var express = require('express');
var router = express.Router();

router.post('/', (clientReq, clientRes, next) => {
	let sql = "SELECT phase.id AS phase_key, phase.name AS phase_name, task.id AS task_key, task.name AS task_name, task.completed AS task_completed, task.date AS task_date, task.state AS task_state, task.priority AS task_priority FROM phase LEFT JOIN task ON task.phase_id=phase.id WHERE phase.account_id = '"+clientReq.session.userId+"'";

	dbPool.execQuery(sql, clientReq, clientRes,(queryErr, queryRes) => {

		if(queryErr) {
			clientRes.send({
				success: false
			});
		}
		else {
			var precPhase = null;
			var phases = [];
			var tasks =  [];
			queryRes.map(row => {
				if(precPhase !== row.phase_key) {

					if(precPhase !== null) {
							phases[phases.length-1].tasks = [...tasks];
							tasks = [];
					}

					precPhase = row.phase_key;
					phases.push({
						key: row.phase_key,
						name: row.phase_name,
						tasks: []
					})
				}
				if(row.task_key) {
					tasks.push({
						key: row.task_key,
						name: row.task_name,
						completed: row.task_completed,
						date: toMySqlDate(row.task_date),
						state: row.task_state,
						priority: row.task_priority
					})
				}

			});
			if(tasks.length>0)
				phases[phases.length-1].tasks = [...tasks];

			clientRes.send({
				success: true,
				phases: phases
			})
		}
		// var io = req.app.get('socketio');
	 	// io.emit("message", "hi!");
		clientRes.end();
	});
});

module.exports = router;
