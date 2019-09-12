var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var session = require('express-session');

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

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'scram table undercover secret key yay',
	resave: true,
	saveUninitialized: true,
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
app.listen(3001);

//---------------- global ----------------
dbPool  = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "scram_db"
});

dbPool.execQuery = (sql, clientReq, clientRes, callback) => {
	if(clientReq.session.id === clientReq.body.sessionId) {
		dbPool.query(sql, (queryErr, queryRes) => {
			if(queryErr) {
				logError("ON QUERY: "+queryErr+"\tQUERY EXECUTED: "+sql);
			}
			callback(queryErr, queryRes, clientReq, clientRes);
		});
	}
	else {
		logError("Invalid session request\tId got from client: "+clientReq.body.sessionId+"\tActual id: "+clientReq.session.id);
		callback("Invalid session", null, clientReq, clientRes);
	}
}

dbPool.execQueryNoSessionValidation = (sql, clientReq, clientRes, callback) => {
	dbPool.query(sql, (queryErr, queryRes) => {
		if(queryErr) {
			logError("ON QUERY: "+queryErr+"\tQUERY EXECUTED: "+sql);
		}
		callback(queryErr, queryRes, clientReq, clientRes);
	});
}

toMySqlDate = (date) => {
	return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

toJsonDate = (date) => {
	let t = date.toString().split(/[- :]/);
	return new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
}



module.exports = app;
