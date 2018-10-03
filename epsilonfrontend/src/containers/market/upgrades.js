import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';

import UpgradeComponent from '../upgrades';
import { makeUpgrades, } from '../../modules/market/upgrades';

const MarketUpgrades = ({ powers, }) => {
  const niceUpgrades = makeUpgrades({ powers, });
  return (
    <UpgradeComponent
      header={'Upgrade your Merchants'}
      upgrades={niceUpgrades}
    />
  );
};

MarketUpgrades.propTypes = {
  powers: PropTypes.objectOf(PropTypes.number),
};

const mapStateToProps = ({ market, }) => ({
  powers: market.powers,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketUpgrades);
