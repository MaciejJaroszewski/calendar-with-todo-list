import React from "react";
import PropTypes from "prop-types";

import {
  CheckBox,
  CheckBoxOutlineBlank,
  DeleteForever,
  Done
} from "../../components/common/icons";
import { classNames } from "../../utils";
import AddNewTask from "./AddNewTask";

class List extends React.PureComponent {
  componentDidUpdate(prevProps, prevState) {
    const { tasks: prevTasks } = prevProps;
    const { tasks: currentTasks } = this.props;

    const maybeEditMode = currentTasks.find(item => item.editMode);

    if (maybeEditMode) {
      const { index: taskIndex } = maybeEditMode;
      const maybeEditModeOff = prevTasks.find(
        ({ index, editMode }) => taskIndex === index && !editMode
      );

      if (maybeEditModeOff && this.input) {
        this.input.focus();
      }
    }
  }

  addTask = () => this.props.onTaskAdd();

  onEditModeClick = taskIndex => () =>
    this.props.onEditModeSet(taskIndex, true);
  onDoneEditModeClick = taskIndex => () =>
    this.props.onEditModeSet(taskIndex, false);

  toggleTask = taskId => this.props.onTaskToggle(taskId);

  deleteTask = taskId => () => this.props.onTaskDelete(taskId);

  onTaskNameChange = taskIndex => ev => {
    const { target: { value } } = ev;

    this.props.onTaskNameChange(taskIndex, value);
  };

  renderCheckedIcon = (done, index) => {
    const onClick = () => this.toggleTask(index);
    return done ? (
      <CheckBox onClick={onClick} />
    ) : (
      <CheckBoxOutlineBlank onClick={onClick} />
    );
  };

  renderTaskName = (task, index) => {
    const { editMode, name } = task;
    return editMode ? (
      <input
        className="add-task-input"
        ref={el => (this.input = el)}
        value={name}
        onChange={this.onTaskNameChange(index)}
      />
    ) : (
      <span onClick={this.onEditModeClick(index)}>{name}</span>
    );
  };

  renderTask = (task, index) => {
    const { done, editMode } = task;
    const className = classNames("task-item", {
      done
    });
    return (
      <div className={className} key={index}>
        {this.renderCheckedIcon(done, index)}
        {this.renderTaskName(task, index)}
        {done && (
          <DeleteForever
            className="delete-icon"
            onClick={this.deleteTask(index)}
          />
        )}
        {editMode && <Done onClick={this.onDoneEditModeClick(index)} />}
      </div>
    );
  };

  renderDaySummary = () => {
    const { tasks } = this.props;
    const tasksCount = tasks.length;
    const doneTasksCount = tasks.filter(({ done }) => done).length;
    const allDone = tasksCount === doneTasksCount;
    const finalMessage = doneTasksCount
      ? "All done. Congrats!"
      : "Plan amazing things here!";
    return (
      <div className="tasks-summary">
        {allDone ? finalMessage : `Completed ${doneTasksCount}/${tasksCount}`}
      </div>
    );
  };

  render() {
    const { tasks } = this.props;
    return (
      <div className="todo-list-container">
        <AddNewTask onAddTask={this.addTask} />
        {tasks.map(this.renderTask)}
        {this.renderDaySummary()}
      </div>
    );
  }
}

List.propTypes = {
  tasks: PropTypes.array.isRequired,

  onTaskNameChange: PropTypes.func.isRequired,
  onEditModeSet: PropTypes.func.isRequired,
  onTaskAdd: PropTypes.func.isRequired,
  onTaskDelete: PropTypes.func.isRequired,
  onTaskToggle: PropTypes.func.isRequired
};

List.defaultProps = {
  tasks: []
};

export default List;
