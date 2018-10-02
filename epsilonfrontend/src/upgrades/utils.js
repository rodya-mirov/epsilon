export const makeCost = ({ amount, unit, }) => ({ amount, unit, });

export const makeUpgrade = ({
  text,
  oldState,
  newState,
  costs = [],
  action = () => {},
  disabled = false,
}) => ({
  text,
  oldState,
  newState,
  costs,
  action,
  disabled,
});
