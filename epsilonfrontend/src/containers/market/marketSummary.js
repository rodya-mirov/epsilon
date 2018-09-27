import React from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';

import { getMerchantDescription, } from '../../modules/market/merchantState';

import { merchantPropType, } from './propTypes';

const MerchantSummary = props => (
  <div>
    <ul>
      {props.merchants.map((merchant, ind) => (
        <li key={ind}>
          Merchant {ind + 1} is {getMerchantDescription(merchant)}
        </li>
      ))}
    </ul>
  </div>
);

MerchantSummary.propTypes = {
  merchants: ImmutablePropTypes.listOf(merchantPropType),
};

export default MerchantSummary;
