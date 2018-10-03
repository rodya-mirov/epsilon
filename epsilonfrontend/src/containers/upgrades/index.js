import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { toEnglishList, } from '../../utils';

const costString = cost => {
  const costs = Object.keys(cost).map(key => `${cost[key]} ${key}`);
  return toEnglishList(costs);
};

const RawUpgradeButton = ({
  text,
  oldState,
  newState,
  cost = {},
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
        {`${text} - ${costString(cost)}`}
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
  cost: PropTypes.objectOf(PropTypes.number),
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
