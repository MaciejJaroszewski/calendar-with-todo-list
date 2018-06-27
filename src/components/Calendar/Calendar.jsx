// ---------------------------------------------------------------------------------------------
// forked and refactored to ES6 from: https://github.com/icarus-sullivan/react-calendar-material
// ---------------------------------------------------------------------------------------------
import React, { Component } from "react";
import PropTypes from "prop-types";

import { ChevronLeft, ChevronRight } from "../../components/common/icons";
import { classNames } from "../../utils";
import { DATES } from "../common/const";

const TODAY = DATES.today();

class Calendar extends Component {
  updateMonth(add) {
    const { selected } = this.props;
    selected.setMonth(selected.getMonth() + add);
    this.props.onDateSelect(selected);
  }

  prev = () => this.updateMonth(-1);
  next = () => this.updateMonth(1);

  onDateClick = opts => () => {
    const { selected: current } = this.props;
    const { date, month } = opts;
    const selected = new Date(current.getTime());
    selected.setMonth(current.getMonth() + month);
    selected.setDate(date.getDate());
    this.props.onDateSelect(selected);
  };

  getDayTasks = timestamp => this.props.tasks[timestamp] || [];

  renderDay(opts = {}) {
    const { current, selected, today } = opts;
    const timestamp = opts.date.getTime();
    const dayTasks = this.getDayTasks(timestamp);
    const tasksToDo = dayTasks.find(i => !i.done);
    const dayTasksLength = dayTasks.length;

    const className = classNames({
      today,
      selected,
      "non-current": !current,
      "to-do": tasksToDo,
      "all-done": dayTasksLength && !tasksToDo
    });

    return (
      <div className="day" key={opts.key}>
        <p className={className} onClick={this.onDateClick(opts)}>
          {opts.date.getDate()}
        </p>
      </div>
    );
  }

  renderDays(copy) {
    const days = [];
    copy.setDate(1);
    const offset = copy.getDay() === 0 ? 7 : copy.getDay();

    copy.setDate(-offset);
    let inMonth = false;
    let lastMonth = true;
    for (let i = 0; i < 42; i++) {
      copy.setDate(copy.getDate() + 1);
      if (i < 30 && copy.getDate() === 1) {
        inMonth = true;
        lastMonth = false;
      } else if (i > 30 && copy.getDate() === 1) {
        inMonth = false;
      }

      const selected = new Date(this.props.selected.getTime());
      const isSelected =
        selected.getFullYear() === copy.getFullYear() &&
        selected.getDate() === copy.getDate() &&
        selected.getMonth() === copy.getMonth();

      const isToday =
        TODAY.getFullYear() === copy.getFullYear() &&
        TODAY.getDate() === copy.getDate() &&
        TODAY.getMonth() === copy.getMonth();

      days.push(
        this.renderDay({
          key: i,
          today: isToday,
          selected: isSelected,
          current: inMonth,
          month: inMonth ? 0 : lastMonth ? -1 : 1,
          date: new Date(copy.getTime())
        })
      );
    }

    return days;
  }

  renderHeaders = () =>
    DATES.week_subs.map((item, index) => (
      <p className="day-headers" key={index}>
        {item}
      </p>
    ));

  render() {
    const { selected } = this.props;

    const copy = new Date(selected.getTime());

    const month = DATES.months[selected.getMonth()];
    const year = selected.getFullYear();

    return (
      <div className="calendar-wrapper">
        <div className="calendar">
          <div className="month">
            <ChevronLeft onClick={this.prev} />
            <p className="month-title">
              {month}
              <br />
              <span className="month-year">{year}</span>
            </p>
            <ChevronRight onClick={this.next} />
          </div>
          <div className="footer">
            {this.renderHeaders()}
            {this.renderDays(copy)}
          </div>
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  selected: PropTypes.object.isRequired,
  tasks: PropTypes.object.isRequired,

  onDateSelect: PropTypes.func
};

Calendar.defaultProps = {
  selected: DATES.today(),
  tasks: {},

  onDateSelect: () => {}
};

export default Calendar;
