export const UNPLOWED = 'UNPLOWED';
export const PLOWED = 'PLOWED';
export const PLANTED = 'PLANTED';
export const READY_FOR_HARVEST = 'READY_FOR_HARVEST';

const farmerAction = {
  UNPLOWED: 'plowing',
  PLOWED: 'planting',
  PLANTED: 'watching the grass grow',
  READY_FOR_HARVEST: 'harvesting',
};

export const getFarmerDescription = (farmer, plotState) => {
  return farmer.working ? farmerAction[plotState] : 'bored';
};

export const makeInitialStateLengths = () => ({
  UNPLOWED: 18,
  PLOWED: 6,
  PLANTED: 60,
  READY_FOR_HARVEST: 6,
});
