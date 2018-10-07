import React from 'react';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';

import MarketSummary from './marketSummary';
import MarketGrid from './grid';
import MarketUpgrades from './upgrades';
import TransactionsOptions from './options';

import Wrapper from '../wrapper';

import './market.css';
import { goBack, } from '../../modules/router';

const makeTitle = () => ({
  title: 'Buying and Selling',
  message: 'Welcome to the public market',
});

const WrappedMarket = ({ isActive, goBack, }) => {
  if (!isActive) {
    goBack();
  }

  return Wrapper({
    headerProps: makeTitle(),
    MainComponent: MarketGrid,
    RhsComponents: [TransactionsOptions, MarketUpgrades, MarketSummary,],
  });
};

const mapStateToProps = ({ market, }) => ({
  isActive: market.isActive,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      goBack: goBack,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedMarket);
