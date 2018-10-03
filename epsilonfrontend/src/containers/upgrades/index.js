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
  return disabled ? (
    <button
      type="button"
      className="btn mt-1 btn-secondary btn-sm"
      disabled={true}
    >{`${text}: ${oldState} (Complete)`}</button>
  ) : (
    <div>
      <button
        type="button"
        className="btn mt-1 btn-secondary btn-sm mr-2"
        onClick={action}
      >
        {`${text} - ${toEnglishList(costs.map(niceCost))}`}
      </button>
      {`${oldState}`}
      &rarr;
      {`${newState}`}
    </div>
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
    <h6 className="font-weight-bold">{header}</h6>
    {upgrades.map((upgrade, ind) => (
      <div className="text-left" key={ind}>
        <UpgradeButton {...upgrade} />
      </div>
    ))}
  </div>
);

UpgradeSummary.propTypes = {
  header: PropTypes.string,
  upgrades: PropTypes.arrayOf(PropTypes.shape(upgradeProptypes)),
};

export default UpgradeSummary;
