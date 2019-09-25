import React from 'react';
import Task from './Task'
import {dragOverSetup} from '../global.js'

class Phase extends React.Component {
	render() {
		return (
			<div name="drop-enabled" className="w3-container w3-border w3-border-grey phase-container w3-padding" onDragOver={dragOverSetup} onDrop={(e) => this.props.addDroppedTask(e)}>
				<div>
					<input type="text" className="w3-margin-left w3-input w3-margin-top w3-margin-bottom w3-border-grey w3-text-blue dynamic-input phase-name-input" ref="nameInput" defaultValue={this.props.name} placeholder="Insert phase name" onBlur={() => this.props.changeName(this.refs.nameInput.value)}/>
					<button className="corner-btn w3-circle w3-button w3-white w3-border w3-border-pale-red w3-text-red w3-hover-red" onClick={() => this.props.removePhase()}>X</button>
				</div>
				{
					this.props.tasks.map(o => <Task key={o.key+''+o.name} name={o.name} completed={o.completed} date={o.date} state={o.state} priority={o.priority} setDragItemKeyBuf={() => this.props.setDragItemKeyBuf(o.key)} changeTaskName={(newName) => this.props.changeTaskName(o.key,newName)} removeTask={() => this.props.removeTask(o.key)} changeTaskPriority={(newPriority) => this.props.changeTaskPriority(o.key,newPriority)} changeTaskState={(newState) => this.props.changeTaskState(o.key,newState)} markTaskComplete={() => this.props.markTaskComplete(o.key)} insertTaskAfter={() => this.props.insertTaskAfter(o.key)}/>)
				}
				<div className="w3-container w3-center no-select" name="drop-enabled">
					<button name="drop-enabled" className="w3-button w3-white w3-border w3-border-green w3-round-large" onClick={() => this.props.addTask()}>+</button>
					<div className="w3-text-green" name="drop-enabled">Add task</div>
				</div>
			</div>
		);
	}
}

export default Phase;
