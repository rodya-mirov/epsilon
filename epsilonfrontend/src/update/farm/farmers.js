import { makeContainsFarmers, } from '../../modules/farm/utils';
import {
  UNPLOWED,
  PLOWED,
  READY_FOR_HARVEST,
} from '../../modules/farm/plotState';
import { updateSquare, stateChange, } from './utils';

// NB: farmers do not go to PLANTED plots because they do not require work
const keyPrecedence = [READY_FOR_HARVEST, PLOWED, UNPLOWED,];

const workingFarmer = (farmer, row, col) => ({
  ...farmer,
  row,
  col,
  working: true,
});

const boredFarmer = farmer => ({
  ...farmer,
  row: -1,
  col: -1,
  working: false,
});

const updateFarmerState = (farmerIndex, newFarmer, farmState) => ({
  ...farmState,
  farmers: farmState.farmers.update(farmerIndex, () => newFarmer),
});

const requiresSeed = square =>
  square.state === PLOWED && square.timeLeftInState <= 0;

const updateFarmer = (farmerIndex, farm, resources) => {
  const { stateLengths, powers, } = farm;

  const hasSeed = resources.seeds >= 1;
  const myFarmer = farm.farmers.get(farmerIndex);
  const otherFarmers = farm.farmers.remove(farmerIndex);
  const isOccuppied = makeContainsFarmers(otherFarmers);

  for (const desiredState of keyPrecedence) {
    // find an unoccuppied square of this state, if possible,
    // then work it
    for (let rowIndex = 0; rowIndex < farm.numRows; rowIndex++) {
      for (let colIndex = 0; colIndex < farm.numCols; colIndex++) {
        const square = farm.squares.get(rowIndex).get(colIndex);
        // skip any square which is occuppied, in the wrong state, or unworkable
        if (
          square.state !== desiredState ||
          isOccuppied(rowIndex, colIndex) ||
          (requiresSeed(square) && !hasSeed)
        ) {
          continue;
        }

        // Then we're working; update the farmer...
        farm = updateFarmerState(
          farmerIndex,
          workingFarmer(myFarmer, rowIndex, colIndex),
          farm
        );

        // Then see about updating the square
        // if it has timeleft > 0, we just tick it down and we're done
        if (square.timeLeftInState > 0) {
          const newSquare = {
            ...square,
            timeLeftInState: square.timeLeftInState - powers[square.state],
          };
          farm = updateSquare(rowIndex, colIndex, newSquare, farm);
          return { farm, resources, };
        }

        // otherwise it's finished
        if (desiredState === READY_FOR_HARVEST) {
          resources = {
            ...resources,
            limes: resources.limes + 1,
          };
        }
        if (desiredState === PLOWED) {
          resources = {
            ...resources,
            seeds: resources.seeds - 1,
          };
        }
        farm = updateSquare(
          rowIndex,
          colIndex,
          stateChange({ square, stateLengths, }),
          farm
        );
        return {
          resources,
          farm,
        };
      }
    }
  }

  // if we got here, it didn't work
  return {
    farm: {
      ...farm,
      farmers: farm.farmers.update(farmerIndex, () => boredFarmer(myFarmer)),
    },
    resources,
  };
};

/**
 *
 * @param {*} Contains farm: farmState, resources: resourcesState
 * @returns {farm: newFarmState, resources: newResourcesState}
 */
export const updateFarmers = ({ farm, resources, }) => {
  const numFarmers = farm.farmers.size;

  for (let farmerIndex = 0; farmerIndex < numFarmers; farmerIndex++) {
    const result = updateFarmer(farmerIndex, farm, resources);
    farm = result.farm;
    resources = result.resources;
  }

  return { farm, resources, };
};
