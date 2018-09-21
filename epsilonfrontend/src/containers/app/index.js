import React from 'react';
import { Route, Link, } from 'react-router-dom';
import Home from '../home';
import Farm from '../farm';
import TodoList from '../todo';

const App = () => (
  <div>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top">
      <div className="container">
        <Link className="navbar-brand" to="/farm">
          Farm
        </Link>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/todo">
                TODO
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
      <Route exact path="/todo" component={TodoList} />
    </main>
  </div>
);

export default App;
