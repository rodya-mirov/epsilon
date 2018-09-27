import { alea, } from 'seedrandom';
import { isPassable, } from '../../modules/market/squares';
import { NORTH, SOUTH, EAST, WEST, } from '../../modules/market/merchantState';

const NO_MOVEMENT = 'NO_MOVEMENT';
const dirs = [NORTH, SOUTH, EAST, WEST, NO_MOVEMENT,];

const baseWeight = 5;
const historyWeight = 3;
const noMovementWeight = 50; // overrides baseWeight

const makeWeights = (history, allowedDirections) => {
  const weights = [];
  let totalWeight = 0;

  for (const dir of dirs) {
    if (allowedDirections.includes(dir)) {
      weights[dir] = baseWeight;
      totalWeight += baseWeight;
    }
  }

  weights[NO_MOVEMENT] = noMovementWeight;
  totalWeight += noMovementWeight - baseWeight;

  for (const dir of history) {
    if (allowedDirections.includes(dir)) {
      weights[dir] += historyWeight;
      totalWeight += historyWeight;
    }
  }

  // this way, the total weight is one
  for (const dir of allowedDirections) {
    weights[dir] /= totalWeight;
  }

  return weights;
};

const shifted = ({ row, col, }, dir) => {
  switch (dir) {
  case NORTH:
    return { row: row - 1, col, };

  case SOUTH:
    return { row: row + 1, col, };

  case EAST:
    return { row, col: col + 1, };

  case WEST:
    return { row, col: col - 1, };

  case NO_MOVEMENT:
    return { row, col, };

  default:
    throw new Error(`Unrecognized direction ${dir}`);
  }
};

const movePedestrian = (pedestrian, dir) => {
  const { history, } = pedestrian;
  const { row, col, } = shifted(pedestrian, dir);

  return {
    ...pedestrian,
    history: history.slice(1).push(dir),
    row,
    col,
  };
};

const getAllowedDirections = ({ row, col, }, isLegal) => {
  return dirs
    .map(dir => ({
      ...shifted({ row, col, }, dir),
      dir,
    }))
    .filter(({ row, col, }) => isLegal({ row, col, }))
    .map(o => o.dir);
};

const updatePedestrian = (pedestrian, isLegal, rng) => {
  const allowedDirections = getAllowedDirections(pedestrian, isLegal);
  const movementWeights = makeWeights(pedestrian.history, allowedDirections);

  let rngVal = rng();

  for (const dir of allowedDirections.filter(dir => dir !== NO_MOVEMENT)) {
    rngVal -= movementWeights[dir];
    if (rngVal <= 0) {
      return movePedestrian(pedestrian, dir);
    }
  }

  return pedestrian;
};

export const updatePedestrians = state => {
  const { market, } = state;
  const { ticks, } = state;
  const rng = alea(String(ticks.ticks));

  let pedestrians = market.pedestrians;

  for (let pedInd = 0; pedInd < market.pedestrians.size; pedInd++) {
    const oldPedestrians = pedestrians;
    const isLegal = ({ row, col, }) =>
      row >= 0 &&
      row < market.numRows &&
      col >= 0 &&
      col < market.numCols &&
      !oldPedestrians.some(ped => ped.row === row && ped.col === col) &&
      isPassable(market.squares.get(row).get(col));

    const newPed = updatePedestrian(oldPedestrians.get(pedInd), isLegal, rng);

    pedestrians = pedestrians.update(pedInd, () => newPed);
  }

  return {
    ...state,
    market: {
      ...market,
      pedestrians: pedestrians,
    },
  };
};
