import React from 'react';

import PropTypes from 'prop-types';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';

const ResourceSummary = props => (
  <div className="row">
    <div className="mt-3 col-3">
      <h6 className="font-weight-bold">Available Resources</h6>
      <ul className="list-unstyled">
        <li>
          <em className="mr-2">Harvested Limes:</em> {props.limes}
        </li>
        <li>
          <em className="mr-2">Available Seeds:</em> {props.seeds}
        </li>
        <li>
          <em className="mr-2">Money:</em> {props.money}
        </li>
      </ul>
    </div>

    <div className="mt-3 col-3">
      <h6 className="font-weight-bold">General Information</h6>
      <ul className="list-unstyled">
        <li>
          <em className="mr-2">Total Ticks:</em> {props.ticks}
        </li>
      </ul>
    </div>
  </div>
);

ResourceSummary.propTypes = {
  limes: PropTypes.number,
  seeds: PropTypes.number,
  money: PropTypes.number,
  ticks: PropTypes.number,
};

const mapStateToProps = ({ resources, general, }) => ({
  limes: resources.limes,
  seeds: resources.seeds,
  money: resources.money,
  ticks: general.ticks,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceSummary);
