import React from 'react';

import PropTypes from 'prop-types';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';

import { setPauseAction, } from '../../modules/general';

const PauseButton = ({ paused, setPause, }) => (
  <div>
    <button onClick={() => setPause(!paused)}>
      {paused ? 'Unpause' : 'Pause'}
    </button>
  </div>
);

PauseButton.propTypes = {
  paused: PropTypes.bool,
  setPause: PropTypes.func,
};

const mapStateToProps = ({ general, }) => ({
  paused: general.paused,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setPause: wantPause => setPauseAction(wantPause),
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PauseButton);
