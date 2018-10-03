import { List, } from 'immutable';

import { makeArrayGrid, arrayGridToImmutable, } from '../../utils';

import {
  makeEmptySquare,
  makeEmptyReservedSquare,
  makeHorizontalStandSquare,
  makeMerchantSquare,
  makeCustomerPlaceSquare,
  makeSquareRotator,
} from './squares';

import {
  randomDirection,
  badDirectionError,
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
} from './directions';

import {
  WAITING_FOR_CUSTOMER,
  makeStateLengths,
  EAST,
  WEST,
  NORTH,
  SOUTH,
  initActionPowers,
} from './merchantState';

import { initTransactions, } from './transactions';

// used for initialization
const initNumRows = 15;
const initNumCols = 20;
const initNumStands = 8;
const initNumPedestrians = 30;

// NB: don't change this probably?
const STAND_DIMENSION = 3; // dimension (length and width) of the stand, including "owned space" but not including buffer between stands
const STAND_BUFFER = 1; // number of empty spaces which must exist between stands
const PEDESTRIAN_HISTORY_LENGTH = 10; // keep track of this many 'moves' per each pedestrian

const makeRawTopStandSquares = () => {
  // everything starts off as empty
  const squareTypes = makeArrayGrid(
    STAND_DIMENSION,
    STAND_DIMENSION,
    makeEmptyReservedSquare
  );

  squareTypes[0][1] = makeMerchantSquare();

  for (let col = 0; col < STAND_DIMENSION; col++) {
    squareTypes[1][col] = makeHorizontalStandSquare();
  }

  squareTypes[2][1] = makeCustomerPlaceSquare();

  // reshape the output to have coordinates and the square as a field inside
  return squareTypes.flatMap((row, rowInd) =>
    row.map((square, colInd) => ({
      square,
      row: rowInd,
      col: colInd,
    }))
  );
};

const makeStandPositionRotator = merchantDirection => {
  switch (merchantDirection) {
  case TOP:
    // default place means no movement on the position
    return ({ row, col, }) => ({ row, col, });

  case RIGHT:
    // 90 degrees clockwise
    return ({ row, col, }) => ({
      row: col,
      col: STAND_DIMENSION - row - 1,
    });

  case LEFT:
    // 90 degrees ccw
    return ({ row, col, }) => ({
      row: STAND_DIMENSION - col - 1,
      col: row,
    });

  case BOTTOM:
    // 180 degrees, which is just reflection
    return ({ row, col, }) => ({
      row: STAND_DIMENSION - row - 1,
      col: STAND_DIMENSION - col - 1,
    });

  default:
    throw badDirectionError(merchantDirection);
  }
};

const makeStandRotation = merchantDirection => positionSquare => {
  const squareRotator = makeSquareRotator(merchantDirection);
  const positionRotator = makeStandPositionRotator(merchantDirection);

  const { square, row, col, } = positionSquare;
  return {
    square: squareRotator(square),
    ...positionRotator({ row, col, }),
  };
};

const makeStandSquares = stand => {
  const rawSquares = makeRawTopStandSquares();
  const rotation = makeStandRotation(stand.merchant);
  const translation = square => ({
    ...square,
    row: square.row + stand.ymin,
    col: square.col + stand.xmin,
  });
  return rawSquares.map(rotation).map(translation);
};

const makeRandomStandAt = (row, col, rng) => {
  const merchant = randomDirection(rng);
  return {
    xmin: col,
    xmax: col + STAND_DIMENSION - 1,
    ymin: row,
    ymax: row + STAND_DIMENSION - 1,
    merchant,
  };
};

// Check if a given rectangle has all associated squares unoccupied
const squareFits = ({ xmin, xmax, ymin, ymax, }, isOccupied) => {
  for (let y = ymin; y <= ymax; y++) {
    for (let x = xmin; x <= xmax; x++) {
      if (isOccupied({ row: y, col: x, })) {
        return false;
      }
    }
  }
  return true;
};

const findAllowedStandPlaces = (numRows, numCols, isOccupied) => {
  // go xmin->xmax or ymin->ymax
  // include the width, buffers on both sides, and -1 to turn < into <=
  const offset = STAND_DIMENSION + 2 * STAND_BUFFER - 1;

  // enumerate all UL corners that would fit in the market, if it was empty
  // then filter down to just those corners where the stand actually fits
  const out = [];

  for (let row = 0; row + offset < numRows; row++) {
    for (let col = 0; col + offset < numCols; col++) {
      const fits = squareFits(
        { ymin: row, ymax: row + offset, xmin: col, xmax: col + offset, },
        isOccupied
      );
      if (fits) {
        // shift the coordinates; they refer to the UL corner with buffer
        out.push({ row: row + STAND_BUFFER, col: col + STAND_BUFFER, });
      }
    }
  }

  return out;
};

const makeRawStand = (numRows, numCols, isOccupied, rng) => {
  const allowedPlaces = findAllowedStandPlaces(numRows, numCols, isOccupied);

  if (allowedPlaces) {
    const { row, col, } = allowedPlaces[
      Math.floor(rng() * allowedPlaces.length)
    ];
    const stand = makeRandomStandAt(row, col, rng);
    const standSquares = makeStandSquares(stand);
    return { stand, standSquares, };
  }

  return { success: false, };
};

const touchesStand = ({ standSquares, }) => ({ row, col, }) =>
  standSquares.some(square => row === square.row && col === square.col);

const makeInitialStands = (numRows, numCols, numStands, rng) => {
  let allStands = List();
  let allStandSquares = List();

  for (let merchantInd = 0; merchantInd < numStands; merchantInd++) {
    // nail down allStandSquares to make eslint happy
    const existingStandSquares = allStandSquares;
    const isOccupied = touchesStand({ standSquares: existingStandSquares, });

    const { stand, standSquares, success = true, } = makeRawStand(
      numRows,
      numCols,
      isOccupied,
      rng
    );
    if (success) {
      allStands = allStands.concat(stand);
      allStandSquares = allStandSquares.concat(standSquares);
    }
  }

  return { stands: allStands, standSquares: allStandSquares, };
};

const makeSquares = (numRows, numCols, standSquares) => {
  const allSquares = makeArrayGrid(numRows, numCols, makeEmptySquare);

  standSquares.forEach(({ row, col, square, }) => {
    allSquares[row][col] = square;
  });

  return {
    squares: arrayGridToImmutable(allSquares),
  };
};

const makeMerchantStand = ({ rawStand, rng, stateLengths, }) => {
  const state = WAITING_FOR_CUSTOMER;
  const timeLeftInState = Math.floor(stateLengths[state] * rng());
  return {
    rawStand,
    state,
    timeLeftInState,
  };
};

const makeMerchantStands = ({ rawStands, rng, stateLengths, }) =>
  rawStands.map(rawStand => makeMerchantStand({ rawStand, rng, stateLengths, }));

const randomPedHistory = ({ rng, }) => {
  const arr = [];
  for (let i = 0; i < PEDESTRIAN_HISTORY_LENGTH; i++) {
    const r = rng();
    if (r < 0.25) {
      arr.push(NORTH);
    } else if (r < 0.5) {
      arr.push(SOUTH);
    } else if (r < 0.75) {
      arr.push(WEST);
    } else {
      arr.push(EAST);
    }
  }

  return List(arr);
};

const makePedestrian = ({ numRows, numCols, isOccupied, rng, }) => {
  let allowedSquares = [];

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (!isOccupied({ row, col, })) {
        allowedSquares.push({ row, col, });
      }
    }
  }

  const length = allowedSquares.length;
  if (length === 0) {
    return undefined;
  }

  const index = Math.floor(rng() * length);
  const { row, col, } = allowedSquares[index];
  return {
    history: randomPedHistory({ rng, }),
    row,
    col,
  };
};

const makePedestrians = ({ numRows, numCols, standSquares, rng, }) => {
  const baseIsOccupied = touchesStand({ standSquares, });
  let pedestrians = List();

  for (let pedInd = 0; pedInd < initNumPedestrians; pedInd++) {
    const oldPed = pedestrians;
    const isOccupied = ({ row, col, }) =>
      baseIsOccupied({ row, col, }) ||
      oldPed.some(ped => ped.row === row || ped.col === col);

    const newPedestrian = makePedestrian({ numRows, numCols, isOccupied, rng, });
    if (newPedestrian) {
      pedestrians = pedestrians.push(newPedestrian);
    }
  }

  return { pedestrians, };
};

export const makeInitialState = rng => {
  const stateLengths = makeStateLengths();

  const numRows = initNumRows;
  const numCols = initNumCols;
  const { stands, standSquares, } = makeInitialStands(
    numRows,
    numCols,
    initNumStands,
    rng
  );

  const merchantStands = makeMerchantStands({
    rawStands: stands,
    rng,
    stateLengths,
  });
  const { squares, } = makeSquares(numRows, numCols, standSquares);
  const { pedestrians, } = makePedestrians({
    numRows,
    numCols,
    standSquares,
    rng,
  });

  return {
    stateLengths,
    powers: initActionPowers(),
    numRows,
    numCols,
    merchantStands,
    squares,
    pedestrians,
    transactions: initTransactions(),
    isActive: false,
  };
};
