import React from 'react';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';

import UpgradeButtons from '../upgrades';

import { makeUpgrades, } from '../../modules/farm/upgrades';

const FarmerUpgrades = ({ stateLengths, numFarmers, }) => {
  const actualUpgrades = makeUpgrades({ stateLengths, numFarmers, });
  return (
    <UpgradeButtons header={'Upgrade your Farm'} upgrades={actualUpgrades} />
  );
};

const mapStateToProps = ({ farm, }) => ({
  stateLengths: farm.stateLengths,
  numFarmers: farm.numFarmers,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FarmerUpgrades);
