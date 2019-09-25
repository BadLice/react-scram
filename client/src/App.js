import React from 'react';
import {Router,Route,Switch} from "react-router-dom";
import './style/w3.css';
import './style/App.css';
import Home from './components/Home.js'
import Login from './components/Login.js'
import ErrorPage from './components/ErrorPage.js'
import LoadingPage from './components/LoadingPage.js'
import socketIOClient from "socket.io-client";

import { createBrowserHistory } from "history";

const customHistory = createBrowserHistory();

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validLogin: false,
			displayErrorPage: false,
			toValidate:true,
      endpoint: "http://127.0.0.1:3001",
			toUpdateData : false,
			socket: null
		}
	}

	componentDidMount() {
		const { endpoint } = this.state;
		var socket = this.state.socket;
    socket = socketIOClient(endpoint);

		socket.io.on('connect_error', (err) => this.displayErrorPage());

		//listens to server when it emits 'update-data'
		socket.on('update-data',() => this.setState({toUpdateData:true}));

		socket.on('connect', () => {
			if(!window.location.href.includes('error')) {
				fetch('/validateSession',{
				 method: 'post',
				 headers: {
 				 'Content-Type': 'application/json'
	 		 		},
	 				body: JSON.stringify({
		 				socketId: socket.id
	 				})
				})
				.then(res => res.status === 200 ? res.json() : this.displayErrorPage())
				.then(res => {
					if(res) {
						if(res.success) {
							this.setValidLogin();
							this.setState({	toUpdateData : true})
						}
						else {
							this.setInvalidLogin();
						}
					}
				});
			}
		});

		this.setState({socket: socket})
	}

	render() {
		if(this.getDisplayErrorPage() && !window.location.href.includes('error'))
			window.location.href='/error/';

		if(this.state.toValidate && !window.location.href.includes('error'))
			return <LoadingPage />

		return (
			<Router history={customHistory}>
				<Switch>
						<Route
						exact
						path="/"
						render={() =>
							<Login
							setValidLogin={(value) => this.setValidLogin(value)}
							isValidLogin={() => this.isValidLogin()}
							getDisplayErrorPage={() => this.getDisplayErrorPage()}
							displayErrorPage={() => this.displayErrorPage()}
							socket={this.state.socket}
							toUpdateData={this.state.toUpdateData}
							setDataUpdated={() => this.setDataUpdated()}
							setInvalidLogin={() => this.setInvalidLogin()}
							/>
						}
						/>

						<Route
						path="/login/"
						render={() =>
							 <Login
								setValidLogin={(value) => this.setValidLogin(value)}
								isValidLogin={() => this.isValidLogin()}
								getDisplayErrorPage={() => this.getDisplayErrorPage()}
								displayErrorPage={() => this.displayErrorPage()}
								socket={this.state.socket}
								toUpdateData={this.state.toUpdateData}
								setDataUpdated={() => this.setDataUpdated()}
								setInvalidLogin={() => this.setInvalidLogin()}
							 />
						 }
						/>

						<Route
						path="/home/"
						render={() =>
							<Home
								setValidLogin={(value) => this.setValidLogin(value)}
								isValidLogin={() => this.isValidLogin()}
								getDisplayErrorPage={() => this.getDisplayErrorPage()}
								displayErrorPage={() => this.displayErrorPage()}
								socket={this.state.socket}
								toUpdateData={this.state.toUpdateData}
								setDataUpdated={() => this.setDataUpdated()}
							/>
						}
						/>

						<Route
						path="/error/"
						component={ErrorPage}
						/>

						<Route
						component={ErrorPage}
						/>
					</Switch>
			</Router>
		);
	}

	setValidLogin() {
		this.setState({toValidate:false, validLogin: true, toUpdateData:true});
	}

	setInvalidLogin() {
		this.setState({toValidate:false, validLogin: false});
	}

	isValidLogin() {
		return this.state.validLogin;
	}

	displayErrorPage() {
		this.setState({displayErrorPage: true});
	}

	getDisplayErrorPage() {
		return this.state.displayErrorPage;
	}
	setDataUpdated() {
		this.setState({toUpdateData: false})
	}
}

export default App;
