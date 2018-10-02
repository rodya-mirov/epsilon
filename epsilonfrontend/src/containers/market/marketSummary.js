import React from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';

import { getMerchantDescription, } from '../../modules/market/merchantState';

import { merchantPropType, } from './propTypes';

const MerchantSummary = props => (
  <div className="mt-3">
    <h6 className="font-weight-bold">Merchant Activities</h6>
    <ul className="fix-height">
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

const mapStateToProps = ({ market, }) => ({
  merchants: market.merchantStands,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MerchantSummary);
