import React from 'react';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import { Redirect, } from 'react-router-dom';

import './farm.css';
import FarmerSummary from './farmerStates';
import FarmerUpgrades from './upgrades';
import PlotGrid from './grid';
import Wrapper from '../wrapper';

const WrappedFarm = ({ isActive, }) => {
  if (!isActive) {
    return (
      <div>
        <p>Sup</p>
        <Redirect to="/" />
      </div>
    );
  }

  return Wrapper({
    headerProps: {
      title: 'Farming is Repetitive',
      message: 'Welcome to your lovely farm',
    },
    MainComponent: PlotGrid,
    RhsComponents: [FarmerUpgrades, FarmerSummary,],
  });
};

const mapStateToProps = ({ farm, }) => {
  return {
    isActive: farm.isActive,
  };
};

// no actions yet
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedFarm);
