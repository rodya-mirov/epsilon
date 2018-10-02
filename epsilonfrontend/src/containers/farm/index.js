import React from 'react';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import { Redirect, } from 'react-router-dom';

import './farm.css';
import FarmerSummary from './farmerStates';
import FarmerUpgrades from './upgrades';
import PlotGrid from './grid';
import Wrapper from '../wrapper';

const WrappedFarm = ({ numRows, numCols, isActive, }) => {
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
      message: `Welcome to your lovely ${numCols}x${numRows} farm`,
    },
    MainComponent: PlotGrid,
    UpgradeComponent: FarmerUpgrades,
    SummaryComponent: FarmerSummary,
  });
};

const mapStateToProps = state => {
  const { farm, } = state;
  return {
    numRows: farm.numRows,
    numCols: farm.numCols,
    isActive: farm.isActive,
  };
};

// no actions yet
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedFarm);
