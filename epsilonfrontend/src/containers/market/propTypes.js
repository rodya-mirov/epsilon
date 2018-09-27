import PropTypes from 'prop-types';

const transactionPropType = PropTypes.shape({
  name: String,
  costs: PropTypes.object,
  gains: PropTypes.object,
});

export const merchantPropType = PropTypes.shape({
  state: String,
  transaction: transactionPropType,
});
