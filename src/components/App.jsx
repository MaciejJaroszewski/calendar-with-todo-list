import React from "react";

import Calendar from "./Calendar/Calendar";
import ToDoList from "./ToDoList/List";
import { DATES } from "./common/const";

const newTask = { name: "", done: false, editMode: true };

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: DATES.today(),
      tasks: {}
    };
  }

  onSave = () => {
    const stringifyState = JSON.stringify(this.state);
    window.localStorage.setItem("toDoAppStorage", stringifyState);
  };

  onRestore = () => {
    const appState = window.localStorage.getItem("toDoAppStorage");
    const appParsedState = JSON.parse(appState);
    const state = {
      ...appParsedState,
      selected: new Date(appParsedState.selected)
    };
    this.setState(state);
  };

  onTaskAdd = day => () =>
    this.setState(({ tasks }) => {
      const dayTasks = tasks[day] || [];
      return {
        tasks: {
          ...tasks,
          [day]: [newTask, ...dayTasks]
        }
      };
    });

  onEditModeSet = day => (taskIndex, value) => {
    this.setState(({ tasks }) => ({
      tasks: {
        ...tasks,
        [day]: tasks[day].map(
          (item, index) =>
            index === taskIndex
              ? { ...item, editMode: value }
              : { ...item, editMode: false }
        )
      }
    }));
  };

  onTaskToggle = day => taskId =>
    this.setState(({ tasks }) => ({
      tasks: {
        ...tasks,
        [day]: tasks[day].map(
          (task, index) =>
            index === taskId
              ? { ...task, done: !task.done, editMode: false }
              : task
        )
      }
    }));

  onTaskDelete = day => taskId =>
    this.setState(({ tasks }) => ({
      tasks: {
        ...tasks,
        [day]: tasks[day]
          .map((task, index) => (taskId === index ? undefined : task))
          .filter(_ => _)
      }
    }));

  onTaskNameChange = day => (taskIndex, value) => {
    this.setState(({ tasks }) => ({
      tasks: {
        ...tasks,
        [day]: tasks[day].map(
          (item, index) =>
            index === taskIndex ? { ...item, name: value } : item
        )
      }
    }));
  };

  onDateSelect = selected => this.setState({ selected });

  render() {
    const { selected, tasks } = this.state;
    const tMonth = DATES.months[selected.getMonth()];
    const tDate = selected.getDate();
    const timestamp = selected.getTime();
    const selectedDaysTasks = tasks[timestamp];

    return (
      <div className="app-container">
        <div className="header">
          <p className="header-month">{tMonth.toUpperCase()}</p>
          <p className="header-day">{tDate}</p>
        </div>
        <div className="flex-row">
          <Calendar
            selected={selected}
            tasks={tasks}
            onDateSelect={this.onDateSelect}
          />
          <ToDoList
            tasks={selectedDaysTasks}
            onTaskNameChange={this.onTaskNameChange(timestamp)}
            onEditModeSet={this.onEditModeSet(timestamp)}
            onTaskAdd={this.onTaskAdd(timestamp)}
            onTaskDelete={this.onTaskDelete(timestamp)}
            onTaskToggle={this.onTaskToggle(timestamp)}
          />
        </div>
        <div className="flex-col operations">
          <div className="operations-buttons">
            <button onClick={this.onRestore}>Restore</button>
            <button onClick={this.onSave}>Save</button>
          </div>
          <span className="gdpr-staff">
            By clicking Save button you agree that app will save needed data in
            your browser local storage
          </span>
        </div>
      </div>
    );
  }
}

export default App;
