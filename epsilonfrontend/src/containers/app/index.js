import React from 'react';
import { Route, Link, BrowserRouter as Router, } from 'react-router-dom';
import Farm from '../farm';
import ResourceSummary from '../resources';

import './app.css';

const App = () => (
  <Router>
    <div>
      <nav className="navbar navbar-expand-lg navbar-light static-top lightblue-bg">
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Farm
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/resources">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <Route exact path="/resources" component={ResourceSummary} />
        {/* TODO: this puts Farm at / which is probably not what we want eventually */}
        <Route exact path="/" component={Farm} />
      </main>
    </div>
  </Router>
);

export default App;
