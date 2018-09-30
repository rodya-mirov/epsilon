import React from 'react';

import PropTypes from 'prop-types';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';

const ResourceSummary = props => (
  <div>
    <h5>Available Resources</h5>
    <ul>
      <li>
        <b>Harvested Limes: </b> {props.limes}
      </li>
      <li>
        <b>Available Seeds: </b> {props.seeds}
      </li>
      <li>
        <b>Money: </b> {props.money}
      </li>
    </ul>
  </div>
);

ResourceSummary.propTypes = {
  limes: PropTypes.number,
  seeds: PropTypes.number,
  money: PropTypes.number,
};

const mapStateToProps = ({ resources, }) => ({
  limes: resources.limes,
  seeds: resources.seeds,
  money: resources.money,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceSummary);
