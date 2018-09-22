import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

export const farmerPropType = PropTypes.shape({
  row: PropTypes.number,
  col: PropTypes.number,
});

export const squarePropType = PropTypes.shape({
  state: PropTypes.string,
});

export const gridPropType = ImmutablePropTypes.listOf(
  ImmutablePropTypes.listOf(squarePropType)
);
