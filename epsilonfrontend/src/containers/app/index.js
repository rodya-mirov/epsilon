import React from 'react';
import { Route, Link, } from 'react-router-dom';
import Home from '../home';
import Farm from '../farm';
import TodoList from '../todo';

const App = () => (
  <div>
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
