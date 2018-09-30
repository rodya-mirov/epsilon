import React from 'react';
import { Route, Link, BrowserRouter as Router, } from 'react-router-dom';
import Farm from '../farm';
import Market from '../market';
import MainMenu from '../mainMenu';

import PropTypes from 'prop-types';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';

import { ConversationModal, } from '../modals';

import './app.css';

const App = ({ farmActive, marketActive, }) => (
  <div>
    <ConversationModal />
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light static-top lightblue-bg">
          <div className="container">
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/main">
                    Main
                  </Link>
                </li>
                {!farmActive ? (
                  ''
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/farm">
                      Farm
                    </Link>
                  </li>
                )}
                {!marketActive ? (
                  ''
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/market">
                      Market
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>

        <main>
          <Route exact path="/(main)?" component={MainMenu} />
          <Route exact path="/farm" component={Farm} />
          <Route exact path="/market" component={Market} />
        </main>
      </div>
    </Router>
  </div>
);

App.propTypes = {
  farmActive: PropTypes.bool,
  marketActive: PropTypes.bool,
};

const mapStateToProps = ({ farm, market, }) => ({
  farmActive: !!farm.isActive,
  marketActive: !!market.isActive,
});

// no actions yet
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
