import { toEnglishList, } from '../../utils';
import { oppositeDirection, TOP, BOTTOM, LEFT, RIGHT, } from './directions';

export const WAITING_FOR_CUSTOMER = 'WAITING_FOR_CUSTOMER';
export const BARTERING = 'BARTERING';
export const ACCOUNTING = 'ACCOUNTING';

export const EAST = 'EAST';
export const WEST = 'WEST';
export const NORTH = 'NORTH';
export const SOUTH = 'SOUTH';

const timeLeftMap = {
  WAITING_FOR_CUSTOMER: 15,
  BARTERING: 15,
  ACCOUNTING: 10,
};

const descriptionMap = {
  WAITING_FOR_CUSTOMER: 'waiting for a customer to arrive',
  BARTERING: 'bartering with a customer',
  ACCOUNTING: 'tallying up',
};

const nextStateMap = {
  WAITING_FOR_CUSTOMER: BARTERING,
  BARTERING: ACCOUNTING,
  ACCOUNTING: WAITING_FOR_CUSTOMER,
};

const mapToFunc = (obj, methodDescription) => state => {
  const out = obj[state];
  if (out) {
    return out;
  }

  throw new Error(
    `Unrecognized merchant state '${state}' when processing '${methodDescription}`
  );
};

const simpleMerchantDescription = mapToFunc(
  descriptionMap,
  'merchant action description'
);

const getResourcesString = resourcesObject => {
  const keys = Object.keys(resourcesObject);
  if (!keys) {
    return 'nothing';
  }

  // TODO: put some utility methods in the resources module for
  // doing the "5 of these" strings nicely
  const english = keys.map(key => `${resourcesObject[key]} ${key}`);
  return toEnglishList(english);
};

export const getMerchantDescription = merchant => {
  const { state, } = merchant;

  if (state === BARTERING) {
    const { costs, gains, } = merchant.transaction;
    return `bartering, trading ${getResourcesString(
      costs
    )} for ${getResourcesString(gains)}`;
  } else {
    return simpleMerchantDescription(state);
  }
};

export const getStateLength = mapToFunc(timeLeftMap, 'length of state');

export const getNextState = mapToFunc(nextStateMap, 'next state');

export const getCustomerPlace = ({ merchantStand, }) => {
  const { rawStand, } = merchantStand;
  const { xmin, xmax, ymin, ymax, merchant, } = rawStand;

  const customerOrientation = oppositeDirection(merchant);

  const out = (row, col) => ({
    row,
    col,
  });

  switch (customerOrientation) {
  case TOP:
    return out(ymin, xmin + 1);

  case BOTTOM:
    return out(ymax, xmax - 1);

  case LEFT:
    return out(ymin + 1, xmin);

  case RIGHT:
    return out(ymax - 1, xmax);

  default:
    throw new Error(
      `Unrecognized customer orientation ${customerOrientation} from merchant direction ${merchant}`
    );
  }
};

export const getAccountingObjectPlace = ({ merchantStand, }) => {
  const { rawStand, } = merchantStand;
  const { xmin, xmax, ymin, ymax, merchant, } = rawStand;

  const out = (row, col) => ({ row, col, });

  switch (merchant) {
  case TOP:
    return out(ymin, xmin);

  case BOTTOM:
    return out(ymax, xmax);

  case LEFT:
    return out(ymax, xmin);

  case RIGHT:
    return out(ymin, xmax);

  default:
    throw new Error(`Unrecognized merchant orientation ${merchant}`);
  }
};
