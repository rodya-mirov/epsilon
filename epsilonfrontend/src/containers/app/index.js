import React from 'react';
import { Route, Link, } from 'react-router-dom';
import Home from '../home';
import Farm from '../farm';
import TodoList from '../todo';

import './vendor/bootstrap/css/bootstrap.min.css';

const App = () => (
  //Navigation
  <div>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top">
      <div className="container">
        <a className="navbar-brand" href="/">
          Home
        </a>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="/farm">
                Farm
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/todo">
                TODO
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <header>
      <Link to="/">Home</Link> <Link to="/farm">Farm</Link>{' '}
      <Link to="/todo">TODO</Link>
    </header>

    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/farm" component={Farm} />
      <Route exact path="/todo" component={TodoList} />
    </main>
  </div>
);

export default App;
