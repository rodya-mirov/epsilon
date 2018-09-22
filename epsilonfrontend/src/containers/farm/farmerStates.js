import React from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';

import { getFarmerAction, } from '../../modules/farm';
import { farmerPropType, gridPropType, } from './propTypes';

const FarmerSummary = props => (
  <div className="container mt-2">
    <ul>
      {props.farmers.map((farmer, ind) => (
        <li key={ind}>
          Farmer {ind + 1} at ({farmer.col},{farmer.row}) is{' '}
          {getFarmerAction(props.squares.get(farmer.row).get(farmer.col).state)}
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
