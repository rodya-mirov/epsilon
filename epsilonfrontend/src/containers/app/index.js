import React from 'react';
import { Route, Link, BrowserRouter as Router, } from 'react-router-dom';
import Home from '../home';
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
                <Link className="nav-link" to="/Farm">
                  Farm
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/resources">
                  Resources
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <Route exact path="/" component={Home} />
        <Route exact path="/farm" component={Farm} />
        <Route exact path="/resources" component={ResourceSummary} />
      </main>
    </div>
  </Router>
);

export default App;
