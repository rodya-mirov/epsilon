import { toEnglishList, } from '../../utils';

export const WAITING_FOR_CUSTOMER = 'WAITING_FOR_CUSTOMER';
export const BARTERING = 'BARTERING';
export const ACCOUNTING = 'ACCOUNTING';

const timeLeftMap = {
  WAITING_FOR_CUSTOMER: 30,
  BARTERING: 10,
  ACCOUNTING: 20,
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
