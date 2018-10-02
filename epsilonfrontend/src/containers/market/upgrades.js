import React from 'react';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';

import UpgradeComponent from '../upgrades';
import { makeUpgrades, } from '../../modules/market/upgrades';

const MarketUpgrades = ({ stateLengths, }) => {
  const niceUpgrades = makeUpgrades({ stateLengths, });
  return (
    <UpgradeComponent
      header={'Upgrade your Merchants'}
      upgrades={niceUpgrades}
    />
  );
};

MarketUpgrades.propTypes = {};

const mapStateToProps = ({ market, }) => ({
  stateLengths: market.stateLengths,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketUpgrades);
