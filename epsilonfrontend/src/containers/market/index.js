import React from 'react';
import { Redirect, } from 'react-router-dom';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';

import MarketSummary from './marketSummary';
import MarketGrid from './grid';
import MarketUpgrades from './upgrades';

import Wrapper from '../wrapper';

import './market.css';

const makeTitle = ({ numRows, numCols, }) => ({
  title: 'Buying and Selling',
  message: `Welcome to the ${numCols}x${numRows} public market`,
});

const WrappedMarket = ({ numRows, numCols, isActive, }) => {
  if (!isActive) {
    return <Redirect to="/" />;
  }

  return Wrapper({
    headerProps: makeTitle({ numRows, numCols, }),
    MainComponent: MarketGrid,
    UpgradeComponent: MarketUpgrades,
    SummaryComponent: MarketSummary,
  });
};

const mapStateToProps = ({ market, }) => ({
  numRows: market.numRows,
  numCols: market.numCols,
  isActive: market.isActive,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedMarket);
