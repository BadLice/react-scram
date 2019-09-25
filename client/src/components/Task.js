import React from 'react';
import {formatDate,dragOverSetup} from '../global.js'

class Task extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showMask: false,

		}
	}

	render() {
		return (
			<div>
				<div name="task-drag" className={"w3-container w3-padding task-container w3-margin-top w3-margin-bottom " + (this.props.completed ? "w3-opacity" : "")} draggable="true" onDragStart={this.props.setDragItemKeyBuf} onDragOver={(e) => {dragOverSetup(e); this.showMask()}}
				onDrop={() => {this.props.insertTaskAfter(); this.hideMask();}}
				onDragLeave={() => this.hideMask()}>

							<button className="corner-btn w3-circle w3-button w3-white w3-border w3-border-pale-red w3-text-red w3-hover-red" onClick={this.props.removeTask}>X</button>

							<input disabled={this.props.completed} className="w3-margin-left w3-input w3-margin-top w3-margin-bottom w3-border-grey w3-text-pink dynamic-input" type="text" placeholder="Insert task name" ref="nameInput" defaultValue={this.props.name} onBlur={() => this.props.changeTaskName(this.refs.nameInput.value)}/>

							<div className="w3-margin-left w3-margin-top w3-margin-bottom w3-text-grey">{formatDate(this.props.date)}</div>

							<div className="w3-text-grey">
							Priority
								<select disabled={this.props.completed} className="w3-select w3-margin-top w3-margin-bottom task-select" ref="priorityMenu" value={this.props.priority} onChange={() => this.props.changeTaskPriority(this.refs.priorityMenu.value)}>
									<option value=''>--</option>
									<option value='1'>Low</option>
									<option value='2'>Medium</option>
									<option value='3'>High</option>
								</select>
							</div>

							<div className="w3-text-grey">
								State
								<select disabled={this.props.completed} className="w3-select w3-margin-top w3-margin-bottom task-select" ref="stateMenu" value={this.props.state}  onChange={() => this.props.changeTaskState(this.refs.stateMenu.value)}>
									<option value=''>--</option>
									<option value='1'>To work</option>
									<option value='2'>Work in progress</option>
									<option value='3'>Completed</option>
								</select>
							</div>

							<button className={"w3-btn w3-margin-top w3-margin-bottom " + (this.props.completed ? "w3-grey" : "w3-blue")} onClick={this.props.markTaskComplete}>Mark complete</button>
				</div>

				<div className={"w3-container w3-padding w3-margin-top w3-margin-bottom new-task-mask " + (!this.state.showMask ? " w3-hide" : "") }>
				</div>
			</div>
		);
	}

	showMask() {
		this.setState({showMask: true});
	}

	hideMask() {
		this.setState({showMask: false});
	}
}

export default Task;
