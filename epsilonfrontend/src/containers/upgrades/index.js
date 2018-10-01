import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { toEnglishList, } from '../../utils';

const niceCost = ({ amount, unit, }) => `${amount} ${unit}`;

const RawUpgradeButton = ({
  text,
  oldState,
  newState,
  costs = [],
  action,
  disabled,
}) => {
  return (
    <button onClick={action} className={disabled ? 'disabled' : ''}>
      {`${text}: ${oldState} => ${newState} for ${toEnglishList(
        costs.map(niceCost)
      )}`}
    </button>
  );
};

const upgradeProptypes = {
  text: PropTypes.string,
  oldState: PropTypes.any,
  newState: PropTypes.any,
  costs: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number,
      unit: PropTypes.string.isRequired,
    })
  ),
  action: PropTypes.func,
  disabled: PropTypes.bool,
};

RawUpgradeButton.propTypes = upgradeProptypes;

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  action: () => {
    ownProps.action(dispatch);
  },
});

const UpgradeButton = connect(
  undefined,
  mapDispatchToProps
)(RawUpgradeButton);

const UpgradeSummary = ({ header, upgrades, }) => (
  <div>
    <h5>{header}</h5>
    <ul>
      {upgrades.map((upgrade, ind) => (
        <li key={ind}>
          <UpgradeButton {...upgrade} />
        </li>
      ))}
    </ul>
  </div>
);

UpgradeSummary.propTypes = {
  header: PropTypes.string,
  upgrades: PropTypes.arrayOf(PropTypes.shape(upgradeProptypes)),
};

export default UpgradeSummary;
