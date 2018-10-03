export const makeUpgrade = ({
  text,
  oldState,
  newState,
  cost = {},
  action = () => {},
  disabled = false,
}) => ({
  text,
  oldState,
  newState,
  cost,
  action,
  disabled,
});

export const makePowerCostFunction = ({
  upgradeMultipliers,
  upgradePowers,
}) => ({ currentPower, key, }) => {
  return Math.ceil(
    upgradeMultipliers[key] * Math.pow(currentPower, upgradePowers[key])
  );
};
