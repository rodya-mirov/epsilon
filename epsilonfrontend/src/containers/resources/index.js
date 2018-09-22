import React from 'react';

import PropTypes from 'prop-types';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';

const ResourceSummary = props => (
  <div>
    <ul>
      <li>
        <b>Harvested Fruit: </b> {props.fruit}
      </li>
      <li>
        <b>Available Seeds: </b> {props.seeds}
      </li>
    </ul>
  </div>
);

ResourceSummary.propTypes = {
  fruit: PropTypes.number,
  seeds: PropTypes.number,
};

const mapStateToProps = ({ resources, }) => ({
  fruit: resources.fruit,
  seeds: resources.seeds,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceSummary);
