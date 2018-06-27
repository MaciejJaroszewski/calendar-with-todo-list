import React from "react";
import PropTypes from "prop-types";

import { AddCircleOutline } from "../../components/common/icons";

const AddNewTask = ({ onAddTask }) => (
  <div className="todo-add-new" onClick={onAddTask}>
    Add new
    <AddCircleOutline />
  </div>
);

AddNewTask.propTypes = {
  onAddTask: PropTypes.func.isRequired
};

export default AddNewTask;
