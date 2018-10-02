import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const transactionPropType = PropTypes.shape({
  name: PropTypes.string,
  costs: PropTypes.object,
  gains: PropTypes.object,
});

export const merchantPropType = PropTypes.shape({
  state: PropTypes.string,
  transaction: transactionPropType,
});

export const squarePropType = {
  symbol: PropTypes.string,
  squareClass: PropTypes.string,
};

export const squaresPropType = ImmutablePropTypes.listOf(
  ImmutablePropTypes.listOf(PropTypes.shape(squarePropType))
);

export const stateLengthsPropTypes = PropTypes.object;
