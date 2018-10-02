import React from 'react';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';

import ImmutablePropTypes from 'react-immutable-proptypes';

import { getFarmerDescription, } from '../../modules/farm';
import { farmerPropType, gridPropType, } from './propTypes';

const FarmerSummary = ({ squares, farmers, }) => (
  <div>
    <h5>Farmer Activities</h5>
    <ul>
      {farmers.map((farmer, ind) => (
        <li key={ind}>
          Farmer {ind + 1} at ({farmer.col},{farmer.row}) is{' '}
          {getFarmerDescription(
            farmer,
            squares.get(farmer.row).get(farmer.col).state
          )}
        </li>
      ))}
    </ul>
  </div>
);

FarmerSummary.propTypes = {
  squares: gridPropType,
  farmers: ImmutablePropTypes.listOf(farmerPropType),
};

const mapStateToProps = ({ farm, }) => ({
  squares: farm.squares,
  farmers: farm.farmers,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FarmerSummary);
