import React from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

import { getMerchantDescription, } from '../../modules/market/merchantState';

const MerchantSummary = props => (
  <div>
    <ul>
      {props.merchants.map((merchant, ind) => (
        <li key={ind}>
          Merchant {ind + 1} is {getMerchantDescription(merchant.state)}
        </li>
      ))}
    </ul>
  </div>
);

MerchantSummary.propTypes = {
  merchants: ImmutablePropTypes.listOf(
    PropTypes.shape({
      state: String,
    })
  ),
};

export default MerchantSummary;
