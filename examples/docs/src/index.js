import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Step1 from "./usage-with-react/step-1";

const BasicExample = () =>
  <Router>
    <div>
      <Route exact path="/usage-with-react/step-1" render={() => <Step1 search={() => {}} />} />
      <Route exact path="/usage-with-react/step-2" component={require("./usage-with-react/step-2").default} />
      <Route exact path="/usage-with-react/step-3" component={require("./usage-with-react/step-3").default} />
      <Route exact path="/usage-with-react/step-4" component={require("./usage-with-react/step-4").default} />
      <Route exact path="/usage-with-react/step-5" component={require("./usage-with-react/step-5").default} />
    </div>
  </Router>;

render(<BasicExample />, document.getElementById("root"));
