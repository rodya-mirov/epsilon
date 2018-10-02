import React from 'react';
import { Redirect, } from 'react-router-dom';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';

import MarketSummary from './marketSummary';
import MarketGrid from './grid';
import MarketUpgrades from './upgrades';

import Wrapper from '../wrapper';

import './market.css';

const makeTitle = () => ({
  title: 'Buying and Selling',
  message: 'Welcome to the public market',
});

const WrappedMarket = ({ isActive, }) => {
  if (!isActive) {
    return <Redirect to="/" />;
  }

  return Wrapper({
    headerProps: makeTitle(),
    MainComponent: MarketGrid,
    UpgradeComponent: MarketUpgrades,
    SummaryComponent: MarketSummary,
  });
};

const mapStateToProps = ({ market, }) => ({
  isActive: market.isActive,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedMarket);
