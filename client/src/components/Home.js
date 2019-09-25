import React from 'react';
import Phase from './Phase.js'
import LoadingPage from './LoadingPage.js'
import {Redirect} from "react-router-dom";
const uuidv4 = require('uuid/v4');



class Home extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			phases: [],
			dragItemKeyBuf: null,
			notifyText: '',
			showNotify: false,
			notifyTimeoutFunction: null,
			loading: true,
			listenServerChangesInterval: null,
		}
	}

	componentDidMount() {
		if(!this.state.listenServerChangesInterval && window.location.href.includes('home')) {
			this.setState({listenServerChangesInterval: setInterval(() => this.updateData(),1000)});
		}
	}

	render() {
		if(!this.props.isValidLogin())
			return (<Redirect to="/login/" />);

		if(this.state.loading)
			return <LoadingPage />

	  return (
	    <div className="app-container w3-container">
				<div className={(this.state.showNotify ? "w3-animate-opacity" : "hidden-opacity") + " w3-panel w3-margin w3-display-bottomleft w3-dark-grey w3-border w3-border-dark-grey overlay" }>
					<p>{this.state.notifyText}</p>
				</div>
				<table>
					<tbody>
						<tr className="tr-phase-container">
							{
								this.state.phases.map(o =>
								<td className="td-phase-container" key={o.key}>
									<Phase key={o.key+''+o.name} name={o.name} markTaskComplete={(key) => this.markTaskComplete(key)} changeTaskState={(key,newTaskState) => this.changeTaskState(key,newTaskState)} removeTask={(taskKey) => this.removeTask(taskKey)} changeTaskPriority={(key,newPriority) => this.changeTaskPriority(key,newPriority)} changeTaskName={(key,newName) => this.changeTaskName(key,newName)} changeName={(newName) => this.changeName(o.key,newName)} removePhase={() => this.removePhase(o.key)} tasks={o.tasks} addDroppedTask={(e) => this.addDroppedTask(e,o.key)} addTask={(e) => this.addTask(o.key,e)} setDragItemKeyBuf={(taskKey) => this.setDragItemKeyBuf(taskKey)} insertTaskAfter={(taskKey) => this.insertTaskAfter(taskKey)}/>
								</td>)
							}
							<td key="addBtn" className="w3-center td-phase-container no-select">
								<div className="w3-container">
											<button className="w3-button w3-white w3-border w3-border-grey w3-round-large" onClick={() => this.addPhase()}>+</button>
											<div className="w3-text-grey">Add phase</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
	    </div>
	  );
	}

	updateData() {
		if(this.props.toUpdateData) { //only true when server emits 'update-data'; setted true in App.js on socket event listener
				fetch('/getData', {
					method: "POST",
					headers: {
					'Content-Type': 'application/json'
					 },
				}).then(res => res.status === 200 ? res.json() : this.props.displayErrorPage())
				.then((res) => {
					if(res.success)
						this.setState({phases: res.phases, loading: false});
				});
			this.props.setDataUpdated();
		}
	}

	notify(text) {
		if(this.state.notifyTimeoutFunction)
			clearTimeout(this.state.notifyTimeoutFunction)

	 	let notifyTimeoutFunction =	setTimeout((() => {
			this.setState({showNotify: false});
		}).bind(this),3 * 1000);

		this.setState({notifyText: text,showNotify: true, notifyTimeoutFunction: notifyTimeoutFunction})
	}

	insertTaskAfter(taskKey) {
		let newPhaseKey;
		if(taskKey !== this.state.dragItemKeyBuf) {
			let ph = [...this.state.phases];
			let taskSwitch = this.getTask(this.state.dragItemKeyBuf);
			ph.map(o => {
				let index = o.tasks.map(a => a.key).indexOf(taskKey);
				if(index >= 0) {
					newPhaseKey = o.key;
				}
			})

			fetch('/changeTaskPhase', {
				method: "POST",
				headers: {
				 'Content-Type': 'application/json'
		 		},
				body: JSON.stringify({
					taskKey: this.state.dragItemKeyBuf,
					phaseKey: newPhaseKey,
					socketId: this.props.socket.id,
				})
			})
			.then(res => res.status === 200 ? res.json() : this.props.displayErrorPage())
			.then(res => {
				if(res) {
					if(res.success) {
						this.removeTaskOnClient(this.state.dragItemKeyBuf);
						ph.map(o => {
							let index = o.tasks.map(a => a.key).indexOf(taskKey);
							if(index >= 0) {
								o.tasks.splice(index+1,0,taskSwitch);
							}
						})
						this.notify("Task moved");
						this.setState({phases: ph, dragItemKeyBuf: null});
					}
					else {
						this.setState({dragItemKeyBuf: null});
						this.props.displayErrorPage();
					}
				}
			});
		}
		else
			this.setState({dragItemKeyBuf: null});
	}

	setDragItemKeyBuf(taskKey) {
		this.setState({dragItemKeyBuf: taskKey});
	}

	removeTaskOnClient(taskKey) {
		let ph = [...this.state.phases];
		ph.map( o => {
			let taskIndex = o.tasks.map(a => a.key).indexOf(taskKey);
			if(taskIndex >= 0)
				o.tasks.splice(taskIndex,1)
		});
		this.setState({phases: ph});
	}

	removeTask(taskKey) {
		fetch('/removeTask', {
			method: "POST",
			headers: {
			 'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				taskKey: taskKey,
				socketId: this.props.socket.id,
			})
		})
		.then(res => res.status === 200 ? res.json() : this.props.displayErrorPage())
		.then(res => {
			if(res) {
				if(res.success) {
					let ph = [...this.state.phases];
					ph.map( o => {
						let taskIndex = o.tasks.map(a => a.key).indexOf(taskKey);
						if(taskIndex >= 0)
							o.tasks.splice(taskIndex,1)
					});
					this.setState({phases: ph});
					this.notify("Task removed");
				}
				else {
					this.props.displayErrorPage();
				}
			}
		})
	}

	removePhase(key) {
		fetch('/removePhase', {
			method: "POST",
			headers: {
			 'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				phaseKey: key,
				socketId: this.props.socket.id,
			})
		})
		.then(res => res.status === 200 ? res.json() : this.props.displayErrorPage())
		.then(res => {
			if(res) {
				if(res.success) {
					let ph = [...this.state.phases];
					ph.splice(ph.map( o => o.key).indexOf(key),1);

					this.notify("Phase removed");
					this.setState({phases: ph});
				}
				else {
					this.props.displayErrorPage();
				}
			}
		});
	}

	addPhase() {
		var phaseKey = uuidv4();
		fetch('/addPhase', {
			method: "POST",
			headers: {
			 'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				key: phaseKey,
				socketId: this.props.socket.id,
			})
		})
		.then(res => res.status === 200 ? res.json() : this.props.displayErrorPage())
		.then(res => {
			if(res) {
				if(res.success) {
					let ph = [...this.state.phases];
					ph.push({key:phaseKey,name:'',tasks: []});

					this.notify("Phase added");
					this.setState({phases: ph});
				}
				else {
					this.props.displayErrorPage();
				}
			}
		})
	}

	changeName(key,newName) {
		fetch('/changePhaseName', {
			method: "POST",
			headers: {
			 'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				key: key,
				name: newName,
				socketId: this.props.socket.id,
			})
		})
		.then(res => res.status === 200 ? res.json() : this.props.displayErrorPage())
		.then(res => {
			if(res) {
				if(res.success) {
					let ph = [...this.state.phases];
					ph.map(o => (o.key === key) && (o.name=newName));

					this.notify("Name changed");
					this.setState({phases: ph});
				}
			}
		});
	}

	addDroppedTask(e,phaseKey) {
		if(e.target.getAttribute('name') === "drop-enabled") {
			fetch('/changeTaskPhase', {
				method: "POST",
				headers: {
				 'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					taskKey: this.state.dragItemKeyBuf,
					phaseKey: phaseKey,
					socketId: this.props.socket.id,
				})
			})
			.then(res => res.status === 200 ? res.json() : this.props.displayErrorPage())
			.then(res => {
				if(res) {
					let ph = [...this.state.phases];
					let taskSwitch = this.getTask(this.state.dragItemKeyBuf);
					this.removeTaskOnClient(this.state.dragItemKeyBuf);
					ph.map(o => (o.key === phaseKey) && (o.tasks.push(taskSwitch)));

					this.notify("Task moved");
					this.setState({phases: ph,dragItemKeyBuf: null});
				}
			})
		}
	}

	addTask(phaseKey) {
		var newTaskKey = uuidv4();
		fetch('/addTask',{
			method: "POST",
			headers: {
			 'Content-Type': 'application/json'
	 		},
			body: JSON.stringify({
				key: newTaskKey,
				phaseKey: phaseKey,
				socketId: this.props.socket.id,
			})
		})
		.then(res => res.status === 200 ? res.json() : this.props.displayErrorPage())
		.then(res => {
			if(res) {
				if(res.success) {
					let ph = [...this.state.phases];
					ph.map(o => (o.key === phaseKey) && (o.tasks.push({key:newTaskKey, name:'', date: new Date(), priority: '', completed:false, state:'' }))	);

					this.notify("Task added");
					this.setState({phases: ph});
				}
				else {
					this.props.displayErrorPage();
				}
			}
		})
	}


	getTask(taskKey) {
		let ph = [...this.state.phases];
		let res;
		ph.map(o => o.tasks.map(x => (x.key === taskKey) && (res = x)));
		return res;
	}

	changeTaskName(taskKey,newName) {
		fetch('/changeTaskName', {
			method: "POST",
			headers: {
			 'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				key: taskKey,
				name: newName,
				socketId: this.props.socket.id,
			})
		})
		.then(res => res.status === 200 ? res.json() : this.props.displayErrorPage())
		.then(res => {
			if(res) {
				if(res.success) {
					let ph = [...this.state.phases];
					ph.map(o => {
						o.tasks.map(x => {
							(x.key === taskKey) && (x.name=newName)
						});
					});

					this.notify("Name changed");
					this.setState({phases: ph});
				}
			}
		});
	}

	changeTaskPriority(taskKey,newPriority) {
		fetch('/changeTaskPriority', {
			method: "POST",
			headers: {
			 'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				key: taskKey,
				priority: newPriority,
				socketId: this.props.socket.id,
			})
		})
		.then(res => res.status === 200 ? res.json() : this.props.displayErrorPage())
		.then(res => {
			if(res) {
				if(res.success) {
					let ph = [...this.state.phases];
					ph.map(o => {
						o.tasks.map(x => {
							(x.key === taskKey) && (x.priority=newPriority)
						});
					});

					this.notify("Priority changed");
					this.setState({phases: ph});
				}
				else {
					this.props.displayErrorPage();
				}
			}
		});
	}

	changeTaskState(taskKey,newTaskState) {
		fetch('/changeTaskState', {
			method: "POST",
			headers: {
			 'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				key: taskKey,
				state: newTaskState,
				socketId: this.props.socket.id,
			})
		})
		.then(res => res.status === 200 ? res.json() : this.props.displayErrorPage())
		.then(res => {
			if(res) {
				if(res.success) {
					let ph = [...this.state.phases];
					ph.map(o => {
						o.tasks.map(x => {
							(x.key === taskKey) && (x.state=newTaskState)
						});
					});

					this.notify("State changed");
					this.setState({phases: ph});
				}
				else {
					this.props.displayErrorPage();
				}
			}
		});
	}

	markTaskComplete(taskKey) {
		fetch('/markTaskComplete', {
			method: "POST",
			headers: {
			 'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				key: taskKey,
				socketId: this.props.socket.id,
			})
		})
		.then(res => res.status === 200 ? res.json() : this.props.displayErrorPage())
		.then(res => {
			if(res) {
				if(res.success) {
					let ph = [...this.state.phases];
					ph.map(o => {
						o.tasks.map(x => {
							(x.key === taskKey) && (x.completed=!x.completed)
						});
					});

					this.notify("Marked ccompleted");
					this.setState({phases: ph});
				}
				else {
					this.props.displayErrorPage();
				}
			}
		});
	}

}

export default Home;
