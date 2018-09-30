import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, } from 'redux';
import { Link, } from 'react-router-dom';
import { connect, } from 'react-redux';

const MainMenu = ({ newGame, }) => (
  <div className="container">
    <h1 className="mt-5">Main Menu</h1>
    <p>Some things you can do</p>
    <Link to="#" onClick={newGame}>
      New Game
    </Link>
  </div>
);

MainMenu.propTypes = {
  newGame: PropTypes.func,
};

const startNewGame = () => {};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ newGame: () => startNewGame(), }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenu);
