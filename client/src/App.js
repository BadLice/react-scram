import React from 'react';
import {Router, Route } from "react-router-dom";
import './style/w3.css';
import './style/App.css';
import Home from './components/Home.js'
import Login from './components/Login.js'
import { createBrowserHistory } from "history";

const customHistory = createBrowserHistory();

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sessionId: null,
		}
	}

	render() {
		return (
			<Router history={customHistory}>

					<Route
					exact
					path="/"
					render={() =>
						<Login
						setSessionId={(value) => this.setSessionId(value)}
						getSessionId={() => this.getSessionId()}
						/>
					}
					/>

					<Route
					path="/login/"
					render={() =>
						 <Login
							setSessionId={(value) => this.setSessionId(value)}
							getSessionId={() => this.getSessionId()}
						 />
					 }
					/>

					<Route
					path="/home/"
					render={() =>
						<Home
							setSessionId={(value) => this.setSessionId(value)}
							getSessionId={() => this.getSessionId()}
						/>
					}
					/>

			</Router>
		);
	}

	setSessionId(value) {
		this.setState({sessionId: value});
	}

	getSessionId() {
		return this.state.sessionId;
	}
}

export default App;
