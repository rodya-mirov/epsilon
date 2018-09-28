import PropTypes from 'prop-types';

const transactionPropType = PropTypes.shape({
  name: PropTypes.string,
  costs: PropTypes.object,
  gains: PropTypes.object,
});

export const merchantPropType = PropTypes.shape({
  state: PropTypes.string,
  transaction: transactionPropType,
});
