import React from 'react';
import { Route, Link, Router, } from 'react-router-dom';
import Farm from '../farm';
import Market from '../market';
import MainMenu from '../mainMenu';

import PropTypes from 'prop-types';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';

import { ConversationModal, } from '../modals';
import { browserHistory, } from '../../store';

import './app.css';
import { startMarketUnlockConversation, } from '../../modules/conversation';

const UnlockMarketButton = ({ onClick, }) => (
  <div className="unlockButton" onClick={onClick} style={{ cursor: 'pointer', }}>
    Unlock Market
  </div>
);

UnlockMarketButton.propTypes = {
  onClick: PropTypes.func,
};

const App = ({ farmActive, marketActive, unlockMarket, }) => (
  <div>
    <ConversationModal />
    <Router history={browserHistory}>
      <div>
        <nav className="navbar-nav navbar-expand-lg navbar-light static-top lightblue-bg">
          <div className="container mt-2">
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav mr-auto">
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
                  farmActive ? (
                    <UnlockMarketButton onClick={unlockMarket} />
                  ) : (
                    ''
                  )
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/market">
                      Market
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/main">
                    Main
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main>
          <Route exact path="/farm" component={Farm} />
          <Route exact path="/market" component={Market} />
          <Route exact path="/(main)?" component={MainMenu} />
        </main>
      </div>
    </Router>
  </div>
);

App.propTypes = {
  farmActive: PropTypes.bool,
  marketActive: PropTypes.bool,
  unlockMarket: PropTypes.func,
};

const mapStateToProps = ({ farm, market, }) => ({
  farmActive: !!farm.isActive,
  marketActive: !!market.isActive,
});

// no actions yet
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      unlockMarket: startMarketUnlockConversation,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
