import React from "react";
import { render } from "react-dom";
import "./styles.css";

import App from "./components/App";

const MainApp = () => <App />;

render(<MainApp />, document.getElementById("app"));
