import React from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';

import { getFarmerDescription, } from '../../modules/farm';
import { farmerPropType, gridPropType, } from './propTypes';

const FarmerSummary = props => (
  <div>
    <h5>Farmer Activities</h5>
    <ul>
      {props.farmers.map((farmer, ind) => (
        <li key={ind}>
          Farmer {ind + 1} at ({farmer.col},{farmer.row}) is{' '}
          {getFarmerDescription(
            farmer,
            props.squares.get(farmer.row).get(farmer.col).state
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

export default FarmerSummary;
