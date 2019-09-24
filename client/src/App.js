import React from 'react';
import {Router,Route,Switch} from "react-router-dom";
import './style/w3.css';
import './style/App.css';
import Home from './components/Home.js'
import Login from './components/Login.js'
import ErrorPage from './components/ErrorPage.js'
import LoadingPage from './components/LoadingPage.js'
// import { withCookies, Cookies } from 'react-cookie';

import { createBrowserHistory } from "history";

const customHistory = createBrowserHistory();

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validLogin: false,
			displayErrorPage: false,
			toValidate:true,
		}
	}

	componentDidMount() {
		if(!window.location.href.includes('error')) {
			fetch('/validateSession',{
				 method: 'post',
			})
			.then(res => res.status === 200 ? res.json() : this.displayErrorPage())
			.then(res => {
				if(res) {
					if(res.success) {
						this.setValidLogin();
					}
					else {
						this.setInvalidLogin();
					}
				}
			});
		}
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
		this.setState({toValidate:false, validLogin: true});
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
}

export default App;
