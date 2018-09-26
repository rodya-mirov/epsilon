export const LEFT = 'LEFT';
export const RIGHT = 'RIGHT';
export const TOP = 'TOP';
export const BOTTOM = 'BOTTOM';

export const VERTICAL = 'VERTICAL';
export const HORIZONTAL = 'HORIZONTAL';

export const randomDirection = rng => {
  const value = rng();
  if (value < 0.25) {
    return LEFT;
  } else if (value < 0.5) {
    return RIGHT;
  } else if (value < 0.75) {
    return TOP;
  } else {
    return BOTTOM;
  }
};

export const oppositeDirection = direction => {
  switch (direction) {
  case LEFT:
    return RIGHT;
  case RIGHT:
    return LEFT;
  case TOP:
    return BOTTOM;
  case BOTTOM:
    return TOP;
  default:
    throw new Error(`Unrecognized direction: ${direction}`);
  }
};

export const badDirectionError = merchantDirection => {
  return new Error(`Unrecognized direction: ${merchantDirection}`);
};
