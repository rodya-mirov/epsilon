import React from 'react';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';
import PropTypes from 'prop-types';

import UpgradeButtons from '../upgrades';

import { makeUpgrades, } from '../../modules/farm/upgrades';

const FarmerUpgrades = ({ stateLengths, numFarmers, numRows, numCols, }) => {
  const actualUpgrades = makeUpgrades({
    stateLengths,
    numFarmers,
    numRows,
    numCols,
  });
  return (
    <UpgradeButtons header={'Upgrade your Farm'} upgrades={actualUpgrades} />
  );
};

FarmerUpgrades.propTypes = {
  numRows: PropTypes.number,
  numCols: PropTypes.number,
  numFarmers: PropTypes.number,
};

const mapStateToProps = ({ farm, }) => {
  const { stateLengths, numFarmers, numRows, numCols, } = farm;

  return {
    stateLengths,
    numFarmers,
    numRows,
    numCols,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FarmerUpgrades);
