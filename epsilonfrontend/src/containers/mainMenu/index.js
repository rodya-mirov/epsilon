import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import {
  startNewGame,
  loadDebugSave,
  loadRichSave,
} from '../../modules/loadSave';

const MainMenu = ({ newGame, debugSave, richSave, }) => (
  <div className="container">
    <h1 className="mt-5">Main Menu</h1>
    <p>Some things you can do</p>

    <div className="container">
      <div>
        <button
          type="button"
          className="btn btn-space btn-outline-primary"
          onClick={newGame}
        >
          New Game
        </button>
        <br />
        <button
          type="button"
          className="btn mt-3 btn-space btn-outline-primary"
          onClick={debugSave}
        >
          Load Saved State (Everything Unlocked)
        </button>
        <br />
        <button
          type="button"
          className="btn mt-3 btn-space btn-outline-primary"
          onClick={richSave}
        >
          Load Wealthy Save State (Everything Unlocked, Lots of Money)
        </button>
      </div>
    </div>
  </div>
);

MainMenu.propTypes = {
  newGame: PropTypes.func,
  debugSave: PropTypes.func,
  richSave: PropTypes.func,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      newGame: () => startNewGame(),
      debugSave: () => loadDebugSave(),
      richSave: () => loadRichSave(),
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenu);
