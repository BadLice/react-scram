var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var cookieSession = require('cookie-session');
var helmet = require('helmet');
uuid = require('uuid/v4');
require('dotenv').config(); //package for environment variables (create a file named .env in root directory and set there the environment variables, then access them with process.env.VAR_NAME; add .env file to .gitignore)

var getDataRouter = require('./routes/getData');
var addTaskRouter = require('./routes/addTask');
var changeTaskPhaseRouter = require('./routes/changeTaskPhase');
var removeTaskRouter = require('./routes/removeTask');
var removePhaseRouter = require('./routes/removePhase');
var addPhaseRouter = require('./routes/addPhase');
var changePhaseNameRouter = require('./routes/changePhaseName');
var changeTaskNameRouter = require('./routes/changeTaskName');
var changeTaskPriorityRouter = require('./routes/changeTaskPriority');
var changeTaskStateStateRouter = require('./routes/changeTaskState');
var markTaskCompleteRouter = require('./routes/markTaskComplete');
var loginRouter = require('./routes/login');
var signUpRouter = require('./routes/signUp');
var validateSessionRouter = require('./routes/validateSession');


var app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());



app.use(cookieSession({
	name: 'session',
  secret: process.env.COOKIE_SECRET,
  signed: true,
	maxAge: 60 * 60 * 1000 // 1 hour
}));

app.use('/getData', getDataRouter);
app.use('/addTask', addTaskRouter);
app.use('/changeTaskPhase', changeTaskPhaseRouter);
app.use('/removeTask', removeTaskRouter);
app.use('/removePhase', removePhaseRouter);
app.use('/addPhase', addPhaseRouter);
app.use('/changePhaseName', changePhaseNameRouter);
app.use('/changeTaskName', changeTaskNameRouter);
app.use('/changeTaskPriority', changeTaskPriorityRouter);
app.use('/changeTaskState', changeTaskStateStateRouter);
app.use('/markTaskComplete', markTaskCompleteRouter);
app.use('/signUp', signUpRouter);
app.use('/login', loginRouter);
app.use('/validateSession', validateSessionRouter);



logError = (txt) => {
	console.log('\x1b[31m%s\x1b[0m%s', 'ERROR: ',txt);
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
	res.send({
		success: false
	});
	res.end();
});

console.log('\x1b[35m%s\x1b[0m', '----------- RUNNING ON PORT 3001 -----------');

var server = app.listen(3001);

io = require('socket.io').listen(server);
app.set('socketio', io);

io.on("connection", socket => {
	socketClientIdMap.push([socket.id,null]);
  socket.on("disconnect", () => socketClientIdMap = socketClientIdMap.filter(o => o[0] !== socket.id));
});





//---------------- global ----------------

socketClientIdMap = []; //0 = socket.id, 1 = client.id

dbPool  = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DB_USED
});

dbPool.execQuery = (sql, clientReq, clientRes, callback) => {

	//validate cookie session
	let cksql = "SELECT cookie_session FROM account WHERE cookie_session=? AND id=?"
	let ckparams=[
		clientReq.session.cookieSessionId,
		clientReq.session.userId
	];
	dbPool.execQueryNoSessionValidation(cksql, ckparams, clientReq, clientRes, (queryErr, queryRes) => {
		if(queryErr) {
			clientReq.session.userId = null;
			clientRes.send({
				success: false,
				queryErr: true
			});
			clientRes.end();
		}
		else {
			if(queryRes.length>0) {
				dbPool.query(sql, (queryErr, queryRes) => {
					if(queryErr) {
						logError("ON QUERY: "+queryErr+"\tQUERY EXECUTED: "+sql);
					}
					callback(queryErr, queryRes, clientReq, clientRes);

					if((sql.includes('INSERT') || sql.includes('DELETE') || sql.includes('UPDATE')) && clientReq.session.userId && clientReq.body.socketId)
						getSocketIdsFromClientId(clientReq.session.userId,clientReq.body.socketId).map(o => io.to(o).emit('update-data'));

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

}

dbPool.execQueryNoSessionValidation = (sql, queryParams, clientReq, clientRes, callback) => {
	dbPool.query(sql, queryParams, (queryErr, queryRes) => {
		if(queryErr) {
			logError("ON QUERY: "+queryErr+"\tQUERY EXECUTED: "+sql);
		}
		callback(queryErr, queryRes, clientReq, clientRes);
	});
}

toMySqlDate = (date) => {
	return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

mapSocketClientIdf = (socketId,clientId) => {
	socketClientIdMap = socketClientIdMap.filter(o => o[0] !== socketId);
	socketClientIdMap.push([socketId,clientId]);
}

getSocketIdsFromClientId = (clientId,exceptId) => socketClientIdMap.filter(o => (o[1] === clientId) && (o[0] !== exceptId)).map(o => o = o[0]);

module.exports = app;
